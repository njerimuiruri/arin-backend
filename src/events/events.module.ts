import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventsSchema } from './events.schema';
import { EventService } from './events.service';
import { EventsController } from './events.controllers';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Event.name, schema: EventsSchema },
    ]),
  ],
  controllers: [EventsController],
  providers: [EventService, require('../common/services/cloudinary.service').CloudinaryService],
})
export class EventsModule {}
