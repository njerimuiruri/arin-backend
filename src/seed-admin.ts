import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  const adminEmail = 'arinnetwork@gmail.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeThisToAStrongPassword!2025';

  const existingAdmin = await usersService.findOneByEmail(adminEmail);
  if (!existingAdmin) {
    await usersService.createUser(adminEmail, adminPassword, 'admin');
    console.log('Admin user created:', adminEmail);
  } else {
    await usersService.updateUserPassword(adminEmail, adminPassword, 'admin');
    console.log('Admin user password updated:', adminEmail);
  }
  await app.close();
}

bootstrap();
