
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
import { CopModule } from './cop/cop.module';
import { CsrModule } from './csr/csr.module';
import { JournalArticleModule } from './journal-articles/journal-article.module';
import { PolicyBriefModule } from './policy-briefs/policy-brief.module';
import { BlogsModule } from './blogs/blogs.module';
import { TechnicalReportsModule } from './technical-reports/technical-reports.module';
import { NewsBriefModule } from './news-briefs/news-brief.module';
import { ContactsModule } from './contacts/contacts.module';
import { TeamsModule } from './teams/teams.module';
import { VacanciesModule } from './vacancies/vacancies.module';
import { NewslettersModule } from './newsletters/newsletters.module';
import { PressModule } from './press/press.module';
import { CallForBooksModule } from './call-for-books/call-for-books.module';

import { WorkingPaperSeriesModule } from './working-paper-series/working-paper-series.module';

import { ImpactStoriesModule } from './impact-stories/impact-stories.module';
import { PhotosVideosModule } from './photos-videos/photos-videos.module';


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
    CopModule,
    CsrModule,
    JournalArticleModule,
    PolicyBriefModule,
    NewsBriefModule,
    BlogsModule,
    TechnicalReportsModule,
    ContactsModule,
    TeamsModule,
    VacanciesModule,
    NewslettersModule,
    PressModule,
    CallForBooksModule,
    WorkingPaperSeriesModule,

    ImpactStoriesModule,
    PhotosVideosModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
