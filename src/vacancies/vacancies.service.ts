import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vacancy } from './vacancies.schema';

@Injectable()
export class VacanciesService {
  constructor(@InjectModel(Vacancy.name) private vacancyModel: Model<Vacancy>) {}

  async create(data: any): Promise<Vacancy> {
    const vacancy = new this.vacancyModel(data);
    return vacancy.save();
  }

  async findAll(): Promise<Vacancy[]> {
    return this.vacancyModel.find().sort({ datePosted: -1 }).exec();
  }

  async findOne(id: string): Promise<Vacancy | null> {
    return this.vacancyModel.findById(id).exec();
  }

  async update(id: string, data: any): Promise<Vacancy | null> {
    return this.vacancyModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async remove(id: string): Promise<Vacancy | null> {
    return this.vacancyModel.findByIdAndDelete(id).exec();
  }
}
