import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CapacityBuilding, CapacityBuildingSchema } from './capacity-building.schema';
import { CapacityBuildingService } from './capacity-building.service';
import { CapacityBuildingController } from './capacity-building.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CapacityBuilding.name, schema: CapacityBuildingSchema },
    ]),
  ],
  controllers: [CapacityBuildingController],
  providers: [CapacityBuildingService],
})
export class CapacityBuildingModule {}
