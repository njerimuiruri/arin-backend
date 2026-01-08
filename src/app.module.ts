
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ResearchProjectsModule } from './research-projects/research-projects.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      (() => {
        if (!process.env.MONGODB_URI) {
          throw new Error('MONGODB_URI is not defined in the environment variables');
        }
        return process.env.MONGODB_URI;
      })(),
    ),
    UsersModule,
    AuthModule,
    ResearchProjectsModule,
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
