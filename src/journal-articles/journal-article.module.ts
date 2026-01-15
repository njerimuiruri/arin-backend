import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JournalArticle, JournalArticleSchema } from './journal-article.schema';
import { JournalArticleService } from './journal-article.service';
import { JournalArticleController } from './journal-article.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: JournalArticle.name, schema: JournalArticleSchema },
    ]),
  ],
  controllers: [JournalArticleController],
  providers: [JournalArticleService],
})
export class JournalArticleModule {}
