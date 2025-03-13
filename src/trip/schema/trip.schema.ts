import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ _id: false })
class RouteDetails {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Geofence' })
  sourceHub: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Geofence' })
  destinationHub: MongooseSchema.Types.ObjectId;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Geofence' }] })
  viaHub: MongooseSchema.Types.ObjectId[];
}

@Schema({ timestamps: true })
export class Trip extends Document {
  @Prop({ unique: true })
  tripId: string;

  @Prop()
  status: string;

  @Prop()
  movementStatus: string;

  @Prop({ type: Date })
  startDate: Date;

  @Prop({ type: Date })
  endDate: Date;

  @Prop({ default: false })
  isBlocked: boolean;

  @Prop()
  locationStatus: string;

  @Prop({ type: RouteDetails })
  routeDetails: RouteDetails;

  @Prop({ type: Object })
  vehicleDetails: Record<string, any>;

  @Prop({ type: Object })
  clientDetails: Record<string, any>;

  @Prop({ type: Object })
  otherDetails: Record<string, any>;

  @Prop({ type: [Object] })
  alertConfiguration: Record<string, any>[];
}

export const TripSchema = SchemaFactory.createForClass(Trip);
