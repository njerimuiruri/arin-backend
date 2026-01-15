import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnnualReports, AnnualReportsSchema } from './annual-reports.schema';
import { AnnualReportsService } from './annual-reports.service';
import { AnnualReportsController } from './annual-reports.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AnnualReports.name, schema: AnnualReportsSchema },
    ]),
  ],
  controllers: [AnnualReportsController],
  providers: [AnnualReportsService],
})
export class AnnualReportsModule {}
