import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Blogs, BlogsSchema } from './blogs.schema';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blogs.name, schema: BlogsSchema },
    ]),
  ],
  controllers: [BlogsController],
  providers: [BlogsService],
})
export class BlogsModule {}
