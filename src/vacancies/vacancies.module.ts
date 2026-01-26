import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VacanciesController } from './vacancies.controller';
import { VacanciesService } from './vacancies.service';
import { Vacancy, VacancySchema } from './vacancies.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Vacancy.name, schema: VacancySchema }])],
  controllers: [VacanciesController],
  providers: [VacanciesService, require('../common/services/cloudinary.service').CloudinaryService],
})
export class VacanciesModule {}
