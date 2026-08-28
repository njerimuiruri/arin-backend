import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, isValidObjectId } from 'mongoose';
import { Theme } from './theme.schema';

// Some builds of this app don't auto-cast a plain string to ObjectId for the
// `researchProject` ref path, so match on an explicit ObjectId when possible.
const asId = (value: string): Types.ObjectId | string =>
  isValidObjectId(value) ? new Types.ObjectId(value) : value;

@Injectable()
export class ThemesService {
  constructor(
    @InjectModel(Theme.name) private themeModel: Model<Theme>,
  ) {}

  async create(data: any) {
    try {
      if (!data.researchProject || !data.name) {
        throw new BadRequestException('Missing required fields: researchProject, name');
      }
      const maxOrderDoc = await this.themeModel
        .findOne({ researchProject: asId(String(data.researchProject)) })
        .sort({ order: -1 })
        .exec();
      const nextOrder = maxOrderDoc?.order != null ? maxOrderDoc.order + 1 : 0;
      const created = new this.themeModel({ ...data, order: nextOrder });
      return await created.save();
    } catch (error) {
      if (error.name === 'ValidationError') {
        throw new BadRequestException(`Validation failed: ${error.message}`);
      }
      throw error;
    }
  }

  async findAllByProject(researchProject: string) {
    return this.themeModel
      .find({ researchProject: asId(researchProject) })
      .sort({ order: 1 })
      .exec();
  }

  async findById(id: string) {
    const theme = await this.themeModel.findById(id).exec();
    if (!theme) throw new NotFoundException('Theme not found');
    return theme;
  }

  async update(id: string, data: any) {
    const updated = await this.themeModel.findByIdAndUpdate(id, data, { new: true }).exec();
    if (!updated) throw new NotFoundException('Theme not found');
    return updated;
  }

  async delete(id: string) {
    const deleted = await this.themeModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Theme not found');
    return deleted;
  }

  async reorder(researchProject: string, ids: string[]) {
    const ops = ids.map((id, index) =>
      this.themeModel
        .findOneAndUpdate(
          { _id: id, researchProject: asId(researchProject) },
          { order: index },
          { new: true },
        )
        .exec(),
    );
    await Promise.all(ops);
    return { success: true };
  }
}
