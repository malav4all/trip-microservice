import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class RouteDetailsDto {
  @IsNotEmpty()
  @IsString()
  sourceHub: string;

  @IsNotEmpty()
  @IsString()
  destinationHub: string;

  @IsArray()
  @IsString({ each: true })
  viaHub: string[];
}

class VehicleDetailsDto {
  @IsOptional()
  acc: number;

  @IsOptional()
  loadcell: string;

  @IsOptional()
  oacc: string;

  @IsOptional()
  vehname: string;

  @IsOptional()
  parentname: string;

  @IsOptional()
  drivername: string;

  @IsOptional()
  imsi: string;

  @IsOptional()
  type: string;

  @IsOptional()
  operator: string;

  @IsOptional()
  vehnum: string;

  @IsOptional()
  prop: string;

  @IsOptional()
  accid: number;

  @IsOptional()
  client: string;

  @IsOptional()
  driverphone: string;

  @IsOptional()
  vehid: number;

  @IsOptional()
  id: number;

  @IsOptional()
  refid: string;

  @IsOptional()
  camera: string;

  @IsOptional()
  devpass: string;

  @IsOptional()
  accname: string;

  @IsOptional()
  cts: string;

  @IsOptional()
  jts: string;

  @IsOptional()
  updatedts: string;

  @IsOptional()
  priority: string;

  @IsOptional()
  devicetypeid: number;

  @IsOptional()
  name: string;

  @IsOptional()
  imei: string;

  @IsOptional()
  vehtype: string;

  @IsOptional()
  status: string;

  @IsOptional()
  imb: string;
}

class ClientDetailsDto {
  @IsOptional()
  @IsString()
  ConsigneeName: string;

  @IsOptional()
  @IsString()
  ConsignorName: string;

  @IsOptional()
  @IsString()
  receiptNo: string;

  @IsOptional()
  @IsString()
  gstNo: string;
}

class OtherDetailsDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  comments: string[];
}

class AlertConfigurationDto {
  @IsNotEmpty()
  @IsString()
  alertName: string;

  @IsNotEmpty()
  @IsString()
  alertType: string;

  @IsNotEmpty()
  @IsString()
  value: string;

  @IsNotEmpty()
  @IsOptional()
  'alertInterval(in minutes)': number;
}

export class CreateTripDto {
  @IsOptional()
  @IsString()
  status: string;

  @IsOptional()
  @IsString()
  movementStatus: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @IsOptional()
  @IsBoolean()
  isBlocked: boolean;

  @IsOptional()
  @IsString()
  locationStatus: string;

  @IsObject()
  @ValidateNested()
  @Type(() => RouteDetailsDto)
  @IsOptional()
  routeDetails: RouteDetailsDto;

  @IsObject()
  @ValidateNested()
  @Type(() => VehicleDetailsDto)
  @IsOptional()
  vehicleDetails: VehicleDetailsDto;

  @IsObject()
  @ValidateNested()
  @Type(() => ClientDetailsDto)
  @IsOptional()
  clientDetails: ClientDetailsDto;

  @IsObject()
  @ValidateNested()
  @Type(() => OtherDetailsDto)
  @IsOptional()
  otherDetails: OtherDetailsDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AlertConfigurationDto)
  @IsOptional()
  alertConfiguration: AlertConfigurationDto[];
}
