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

export class CreateTripDto {
  @IsOptional()
  @IsString()
  status: string;

  @IsOptional()
  @IsString()
  userId: string;

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

  @IsOptional()
  @IsObject()
  vehicleDetails: Record<string, any>;

  @IsOptional()
  @IsObject()
  tripDetails: Record<string, any>;

  @IsOptional()
  @IsObject()
  clientDetails: Record<string, any>;

  @IsOptional()
  @IsObject()
  otherDetails: Record<string, any>;

  @IsOptional()
  @IsArray()
  alertConfiguration: Record<string, any>[];
}
