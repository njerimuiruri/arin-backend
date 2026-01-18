import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkingPaperSeries, WorkingPaperSeriesSchema } from './working-paper-series.schema';
import { WorkingPaperSeriesService } from './working-paper-series.service';
import { WorkingPaperSeriesController } from './working-paper-series.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: WorkingPaperSeries.name, schema: WorkingPaperSeriesSchema }])],
  providers: [WorkingPaperSeriesService],
  controllers: [WorkingPaperSeriesController],
  exports: [WorkingPaperSeriesService],
})
export class WorkingPaperSeriesModule {}
