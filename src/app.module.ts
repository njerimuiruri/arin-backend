
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ResearchProjectsModule } from './research-projects/research-projects.module';
import { CapacityBuildingModule } from './capacity-building/capacity-building.module';
import { PolicyDialoguesModule } from './policy-dialogues/policy-dialogue.module';
import { EventsModule } from './events/events.module';
import { AnnualReportsModule } from './annual-reports/annual-reports.module';
import { BooksModule } from './books/books.module';
import { ConferencesModule } from './conferences/conferences.module';
import { CsrModule } from './csr/csr.module';
import { JournalArticleModule } from './journal-articles/journal-article.module';
import { PolicyBriefModule } from './policy-briefs/policy-brief.module';
import { AnnualReports } from './annual-reports/annual-reports.schema';

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
    CapacityBuildingModule,
    PolicyDialoguesModule,
    EventsModule,
    AnnualReportsModule,
    BooksModule,
    ConferencesModule,
    CsrModule,
    JournalArticleModule,
    PolicyBriefModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
