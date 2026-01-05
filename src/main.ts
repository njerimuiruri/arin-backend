
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
      'http://127.0.0.1:3000',
    ],
    credentials: true,
  });
  // Serve uploads folder as static
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });
  await app.listen(process.env.PORT ?? 5001);
}
bootstrap();
