import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TechnicalReports, TechnicalReportsSchema } from './technical-reports.schema';
import { TechnicalReportsService } from './technical-reports.service';
import { TechnicalReportsController } from './technical-reports.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TechnicalReports.name, schema: TechnicalReportsSchema },
    ]),
  ],
  controllers: [TechnicalReportsController],
  providers: [TechnicalReportsService],
})
export class TechnicalReportsModule {}
