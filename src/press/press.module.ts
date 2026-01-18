import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Press, PressSchema } from './press.schema';
import { PressService } from './press.service';
import { PressController } from './press.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Press.name, schema: PressSchema }])],
  providers: [PressService],
  controllers: [PressController],
  exports: [PressService],
})
export class PressModule {}
