import mongoose from 'mongoose';

/**
 * One-time script to fix existing Cloudinary PDF URLs in MongoDB.
 *
 * What it does:
 * - Connects to MongoDB using MONGODB_URI
 * - Scans all collections and documents
 * - For every string field that:
 *   - contains '/image/upload/'
 *   - and ends with '.pdf' (case-insensitive)
 *   it replaces '/image/upload/' with '/raw/upload/'
 *
 * Usage:
 *   1. Ensure MONGODB_URI is set in your environment.
 *   2. From the project root, run:
 *        npx ts-node scripts/fix-cloudinary-pdf-urls.ts
 *      or add an npm script that does the same.
 */

function fixPdfUrl(value: string): string | null {
  const IMAGE_SEGMENT = '/image/upload/';
  const RAW_SEGMENT = '/raw/upload/';

  if (
    typeof value === 'string' &&
    value.includes(IMAGE_SEGMENT) &&
    value.toLowerCase().endsWith('.pdf')
  ) {
    return value.replace(IMAGE_SEGMENT, RAW_SEGMENT);
  }

  return null;
}

function walkAndFix(obj: any): boolean {
  let changed = false;

  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      const item = obj[i];
      if (typeof item === 'string') {
        const fixed = fixPdfUrl(item);
        if (fixed !== null) {
          obj[i] = fixed;
          changed = true;
        }
      } else if (item && typeof item === 'object') {
        if (walkAndFix(item)) {
          changed = true;
        }
      }
    }
  } else if (obj && typeof obj === 'object') {
    for (const key of Object.keys(obj)) {
      const value = obj[key];
      if (typeof value === 'string') {
        const fixed = fixPdfUrl(value);
        if (fixed !== null) {
          obj[key] = fixed;
          changed = true;
        }
      } else if (value && typeof value === 'object') {
        if (walkAndFix(value)) {
          changed = true;
        }
      }
    }
  }

  return changed;
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI is not set in the environment.');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  const db = mongoose.connection.db;
  if (!db) {
    console.error('MongoDB connection db handle is not available.');
    process.exit(1);
  }

  const collections = await db.collections();

  for (const collection of collections) {
    const name = collection.collectionName;
    console.log(`Scanning collection: ${name}`);

    const cursor = collection.find({});

    let processed = 0;
    let updated = 0;

    // eslint-disable-next-line no-await-in-loop
    while (await cursor.hasNext()) {
      // eslint-disable-next-line no-await-in-loop
      const doc: any = await cursor.next();
      if (!doc) break;

      processed += 1;

      const docCopy = { ...doc };
      // Do not modify _id directly in the copy we send back
      const { _id, ...rest } = docCopy;

      const changed = walkAndFix(rest);
      if (changed) {
        updated += 1;
        // eslint-disable-next-line no-await-in-loop
        await collection.updateOne({ _id: doc._id }, { $set: rest });
      }
    }

    console.log(
      `Finished collection ${name}: processed=${processed}, updated=${updated}`,
    );
  }

  await mongoose.disconnect();
  console.log('Done. Disconnected from MongoDB.');
}

// Run if called directly
if (require.main === module) {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  main().catch((err) => {
    console.error('Error while fixing Cloudinary PDF URLs:', err);
    process.exit(1);
  });
}

