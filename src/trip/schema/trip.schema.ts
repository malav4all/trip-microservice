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

@Schema({ _id: false })
class VehicleDetails {
  @Prop()
  acc: number;

  @Prop()
  loadcell: string;

  @Prop()
  oacc: string;

  @Prop()
  vehname: string;

  @Prop()
  parentname: string;

  @Prop()
  drivername: string;

  @Prop()
  imsi: string;

  @Prop()
  type: string;

  @Prop()
  operator: string;

  @Prop()
  vehnum: string;

  @Prop()
  prop: string;

  @Prop()
  accid: number;

  @Prop()
  client: string;

  @Prop()
  driverphone: string;

  @Prop()
  vehid: number;

  @Prop()
  id: number;

  @Prop()
  refid: string;

  @Prop()
  camera: string;

  @Prop()
  devpass: string;

  @Prop()
  accname: string;

  @Prop()
  cts: string;

  @Prop()
  jts: string;

  @Prop()
  updatedts: string;

  @Prop()
  priority: string;

  @Prop()
  devicetypeid: number;

  @Prop()
  name: string;

  @Prop()
  imei: string;

  @Prop()
  vehtype: string;

  @Prop()
  status: string;

  @Prop()
  imb: string;
}

@Schema({ _id: false })
class ClientDetails {
  @Prop()
  ConsigneeName: string;

  @Prop()
  ConsignorName: string;

  @Prop()
  receiptNo: string;

  @Prop()
  gstNo: string;
}

@Schema({ _id: false })
class OtherDetails {
  @Prop({ type: [String], default: [] })
  comments: string[];
}

@Schema({ _id: false })
class AlertConfiguration {
  @Prop()
  alertName: string;

  @Prop()
  alertType: string;

  @Prop()
  value: string;

  @Prop({ name: 'alertInterval(in minutes)' })
  alertInterval: number;
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

  @Prop({ type: VehicleDetails })
  vehicleDetails: VehicleDetails;

  @Prop({ type: ClientDetails })
  clientDetails: ClientDetails;

  @Prop({ type: OtherDetails })
  otherDetails: OtherDetails;

  @Prop({ type: [AlertConfiguration] })
  alertConfiguration: AlertConfiguration[];
}

export const TripSchema = SchemaFactory.createForClass(Trip);
