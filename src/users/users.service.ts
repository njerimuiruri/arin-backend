

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async createUser(email: string, password: string, role = 'user'): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 12);
    const createdUser = new this.userModel({ email, password: hashedPassword, role });
    return createdUser.save();
  }


  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.findOneByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }

  async updateUserPassword(email: string, password: string, role = 'user'): Promise<void> {
    const hashedPassword = await bcrypt.hash(password, 12);
    await this.userModel.updateOne(
      { email },
      { $set: { password: hashedPassword, role } }
    );
  }
}
