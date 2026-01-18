import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact, ContactDocument } from './contacts.schema';

@Injectable()
export class ContactsService {
  constructor(
    @InjectModel(Contact.name) private contactModel: Model<ContactDocument>,
  ) {}

  async create(contactData: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }): Promise<Contact> {
    const contact = new this.contactModel(contactData);
    const savedContact = await contact.save();

    return savedContact;
  }

  async findAll(): Promise<Contact[]> {
    return this.contactModel.find().sort({ createdAt: -1 }).exec();
  }

  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: Contact[]; total: number; page: number; pages: number }> {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.contactModel
        .find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.contactModel.countDocuments().exec(),
    ]);

    const pages = Math.ceil(total / limit);

    return { data, total, page, pages };
  }

  async findById(id: string): Promise<Contact | null> {
    return this.contactModel.findById(id).exec();
  }

  async markAsRead(id: string): Promise<Contact | null> {
    return this.contactModel
      .findByIdAndUpdate(id, { isRead: true }, { new: true })
      .exec();
  }

  async delete(id: string): Promise<Contact | null> {
    return this.contactModel.findByIdAndDelete(id).exec();
  }

  async getUnreadCount(): Promise<number> {
    return this.contactModel.countDocuments({ isRead: false }).exec();
  }
}
