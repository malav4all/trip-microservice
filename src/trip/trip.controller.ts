import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { TripService } from './trip.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { ApiResponse } from 'src/comnman/api-response';

@Controller('trip')
export class TripController {
  constructor(private readonly tripService: TripService) {}

  @Post()
  async create(@Body() createTripDto: CreateTripDto) {
    try {
      const trip = await this.tripService.create(createTripDto);
      return new ApiResponse(true, 201, 'Trip created successfully', trip);
    } catch (error) {
      throw new HttpException(
        new ApiResponse(
          false,
          500,
          'Failed to create trip',
          undefined,
          error.message,
        ),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    try {
      const data = await this.tripService.findAll(
        Number(+page),
        Number(+limit),
      );
      return new ApiResponse(true, 200, 'Trips retrieved successfully', data);
    } catch (error) {
      throw new HttpException(
        new ApiResponse(
          false,
          500,
          'Failed to fetch trips',
          undefined,
          error.message,
        ),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('status/:status')
  async findByStatus(
    @Param('status') status: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    try {
      const data = await this.tripService.findByStatus(
        status,
        Number(page),
        Number(limit),
      );
      return new ApiResponse(
        true,
        200,
        `Trips with status ${status} retrieved successfully`,
        data,
      );
    } catch (error) {
      throw new HttpException(
        new ApiResponse(
          false,
          500,
          'Failed to fetch trips by status',
          undefined,
          error.message,
        ),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('vehicle/:vehid')
  async findByVehicleId(@Param('vehid') vehid: number) {
    try {
      const trips = await this.tripService.findByVehicleId(vehid);
      return new ApiResponse(
        true,
        200,
        `Trips for vehicle ID ${vehid} retrieved successfully`,
        trips,
      );
    } catch (error) {
      throw new HttpException(
        new ApiResponse(
          false,
          500,
          'Failed to fetch trips by status',
          undefined,
          error.message,
        ),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('date-range')
  async findByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    try {
      const data = await this.tripService.findByDateRange(
        new Date(startDate),
        new Date(endDate),
        Number(page),
        Number(limit),
      );
      return new ApiResponse(
        true,
        200,
        'Trips within date range retrieved successfully',
        data,
      );
    } catch (error) {
      throw new HttpException(
        new ApiResponse(
          false,
          500,
          'Failed to fetch trips by status',
          undefined,
          error.message,
        ),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const trip = await this.tripService.findOne(id);
      if (!trip) {
        return new ApiResponse(false, 404, 'Trip not found');
      }
      return new ApiResponse(true, 200, 'Trip retrieved successfully', trip);
    } catch (error) {
      throw new HttpException(
        new ApiResponse(
          false,
          500,
          'Failed to fetch trips by status',
          undefined,
          error.message,
        ),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTripDto: UpdateTripDto) {
    try {
      const updatedTrip = await this.tripService.update(id, updateTripDto);
      if (!updatedTrip) {
        return new ApiResponse(false, 404, 'Trip not found');
      }
      return new ApiResponse(
        true,
        200,
        'Trip updated successfully',
        updatedTrip,
      );
    } catch (error) {
      throw new HttpException(
        new ApiResponse(
          false,
          500,
          'Failed to update trips',
          undefined,
          error.message,
        ),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const deletedTrip = await this.tripService.remove(id);
      if (!deletedTrip) {
        return new ApiResponse(false, 404, 'Trip not found');
      }
      return new ApiResponse(true, 200, 'Trip deleted successfully');
    } catch (error) {
      throw new HttpException(
        new ApiResponse(
          false,
          500,
          'Failed to delete trip',
          undefined,
          error.message,
        ),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('search')
  async searchTrips(
    @Query() queryParams: Record<string, any>,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    try {
      const { page: _, limit: __, ...filters } = queryParams;

      const data = await this.tripService.searchTrips(
        filters,
        Number(page),
        Number(limit),
      );
      return new ApiResponse(true, 200, 'Trips retrieved successfully', data);
    } catch (error) {
      return new ApiResponse(
        false,
        500,
        'Failed to search trips',
        undefined,
        error.message,
      );
    }
  }
}
