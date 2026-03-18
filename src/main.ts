
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: [
      'http://localhost:3000', // Next.js default
      'http://localhost:3001', // If you use a different port
      'http://localhost:3002', // Dashboard port
      'http://localhost:3003', // Alternative dashboard port
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      'http://127.0.0.1:3002',
      'http://127.0.0.1:3003',
      'https://arin-africa.org',         // Production website
      'https://www.arin-africa.org',     // Production website (www)
      'https://demo.arin-africa.org',    // Demo website
      'https://dashboard.arin-africa.org',       // Production dashboard
      'https://dashboard.demo.arin-africa.org',  // Demo dashboard
      'https://api.demo.arin-africa.org',        // Demo API
    ],
    credentials: true,
  });
  // Serve uploads folder as static
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 5001);
}
bootstrap();
