import { Module } from '@nestjs/common';
import { TripService } from './trip.service';
import { TripController } from './trip.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Trip, TripSchema } from './schema/trip.schema';
import { Geofence, GeofenceSchema } from './schema/geofence.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Trip.name, schema: TripSchema },
      { name: Geofence.name, schema: GeofenceSchema },
    ]),
  ],
  providers: [TripService],
  controllers: [TripController],
})
export class TripModule {}
