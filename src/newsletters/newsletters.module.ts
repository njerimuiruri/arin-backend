import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Newsletters, NewslettersSchema } from './newsletters.schema';
import { NewslettersService } from './newsletters.service';
import { NewslettersController } from './newsletters.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Newsletters.name, schema: NewslettersSchema },
    ]),
  ],
  controllers: [NewslettersController],
  providers: [NewslettersService],
})
export class NewslettersModule {}
