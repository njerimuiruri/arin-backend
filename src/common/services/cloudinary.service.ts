

import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }


  sanitizePublicId(fileName: string): string {
    return fileName
      .replace(/\.[^/.]+$/, '') // remove extension
      .replace(/[^a-zA-Z0-9-_]/g, '_'); // replace invalid chars with _
  }

  async uploadPdf(fileBuffer: Buffer, fileName: string): Promise<string> {
    return new Promise((resolve, reject) => {
      // Keep .pdf extension so Cloudinary serves Content-Type: application/pdf,
      // which allows the browser to open the file inline instead of downloading it.
      const publicId = this.sanitizePublicId(fileName) + '.pdf';
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'arin/resources/pdfs',
          resource_type: 'raw',
          public_id: publicId,
        },
        (error, result) => {
          if (error) reject(error);
          else if (result) resolve(result.secure_url);
          else reject(new Error('PDF upload failed'));
        },
      );
      uploadStream.end(fileBuffer);
    });
  }

  async uploadRaw(fileBuffer: Buffer, fileName: string): Promise<string> {
    return new Promise((resolve, reject) => {
      // Preserve the original extension so Cloudinary can serve the correct Content-Type.
      const ext = fileName.includes('.') ? fileName.slice(fileName.lastIndexOf('.')) : '';
      const publicId = this.sanitizePublicId(fileName) + ext;
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'arin/resources/files',
          resource_type: 'raw',
          public_id: publicId,
        },
        (error, result) => {
          if (error) reject(error);
          else if (result) resolve(result.secure_url);
          else reject(new Error('File upload failed'));
        },
      );
      uploadStream.end(fileBuffer);
    });
  }

  async uploadImage(fileBuffer: Buffer, fileName: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'arin/resources',
          resource_type: 'auto',
          public_id: this.sanitizePublicId(fileName),
        },
        (error, result) => {
          if (error) reject(error);
          else if (result) resolve(result.secure_url);
          else reject(new Error('Upload failed'));
        },
      );

      uploadStream.end(fileBuffer);
    });
  }

  async uploadVideo(fileBuffer: Buffer, fileName: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'arin/resources/videos',
          resource_type: 'video',
          public_id: fileName.replace(/\.[^/.]+$/, ''),
          chunk_size: 6000000,
        },
        (error, result) => {
          if (error) reject(error);
          else if (result) resolve(result.secure_url);
          else reject(new Error('Upload failed'));
        },
      );

      uploadStream.end(fileBuffer);
    });
  }

  async deleteResource(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Error deleting resource from Cloudinary:', error);
    }
  }

  /**
   * Generates a signed Cloudinary URL for a raw resource (PDF, DOCX, etc.).
   * Extracts the public_id from the full Cloudinary URL and signs it with
   * the API secret so the resource is accessible even when access is restricted.
   */
  generateSignedUrl(cloudinaryUrl: string): string {
    try {
      // Cloudinary raw URL structure:
      // https://res.cloudinary.com/<cloud>/raw/upload/[<transformations>/][v<version>/]<public_id>
      // We need to extract only the public_id (everything after the optional version segment).
      const rawUploadMarker = '/raw/upload/';
      const idx = cloudinaryUrl.indexOf(rawUploadMarker);
      if (idx === -1) {
        // Not a raw resource URL — return as-is
        return cloudinaryUrl;
      }

      let segment = cloudinaryUrl.slice(idx + rawUploadMarker.length);

      // Find the version segment (v followed by digits + slash) wherever it appears,
      // then take everything after it as the public_id.
      // This correctly skips any transformation segments (e.g. fl_attachment) that
      // appear before the version.
      const versionMatch = segment.match(/(?:^|\/)v\d+\//);
      if (versionMatch && versionMatch.index !== undefined) {
        const afterVersion = segment.indexOf(versionMatch[0]) + versionMatch[0].length;
        segment = segment.slice(afterVersion);
      }
      // If no version is present, the segment is already the public_id.

      return cloudinary.url(segment, {
        resource_type: 'raw',
        sign_url: true,
        secure: true,
      });
    } catch {
      return cloudinaryUrl;
    }
  }
}