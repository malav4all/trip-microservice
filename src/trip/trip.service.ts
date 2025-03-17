import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Trip } from './schema/trip.schema';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { Types } from 'mongoose';

@Injectable()
export class TripService {
  constructor(@InjectModel(Trip.name) private tripModel: Model<Trip>) {}

  async create(createTripDto: CreateTripDto): Promise<Trip> {
    try {
      // Check for duplicate trips based on key fields
      // const existingTrip = await this.tripModel
      //   .findOne({
      //     'vehicleDetails.vehid': createTripDto.vehicleDetails?.vehid,
      //     'vehicleDetails.imei': createTripDto.vehicleDetails?.imei,
      //     startDate: createTripDto.startDate,
      //     'routeDetails.sourceHub': createTripDto.routeDetails?.sourceHub,
      //     'routeDetails.destinationHub':
      //       createTripDto.routeDetails?.destinationHub,
      //     status: { $nin: ['COMPLETED', 'CANCELLED'] }, // Exclude completed or cancelled trips
      //   })
      //   .exec();

      // if (existingTrip) {
      //   throw new ConflictException(
      //     'A trip with the same vehicle, date, and route already exists and is not completed',
      //   );
      // }

      // Generate Unique Trip ID
      const tripId = `TRIP-${Date.now()}`;

      // Create a new trip
      const newTrip = new this.tripModel({
        ...createTripDto,
        tripId, // Assign generated trip ID
      });

      return await newTrip.save();
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error creating trip',
        error.message,
      );
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search: any = {},
  ): Promise<{ trips: Trip[]; total: number }> {
    try {
      const skip = (page - 1) * limit;

      // Build match stage based on search parameters
      const matchStage = this.buildMatchStage(search);

      // Aggregation pipeline
      const [result] = await this.tripModel.aggregate([
        // Add match stage if search parameters are provided
        ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
        {
          $facet: {
            metadata: [{ $count: 'total' }],
            data: [
              { $skip: skip },
              { $limit: limit },
              {
                $lookup: {
                  from: 'geofences',
                  localField: 'routeDetails.sourceHub',
                  foreignField: '_id',
                  as: 'routeDetails.sourceHub',
                },
              },
              {
                $lookup: {
                  from: 'geofences',
                  localField: 'routeDetails.destinationHub',
                  foreignField: '_id',
                  as: 'routeDetails.destinationHub',
                },
              },
              {
                $lookup: {
                  from: 'geofences',
                  localField: 'routeDetails.viaHub',
                  foreignField: '_id',
                  as: 'routeDetails.viaHub',
                },
              },
              {
                $lookup: {
                  from: 'users',
                  localField: 'userId',
                  foreignField: '_id',
                  as: 'userDetail',
                },
              },
            ],
          },
        },
      ]);

      // Extract data and total count
      const trips = result?.data || [];
      const total = result?.metadata?.[0]?.total || 0;

      return { trips, total };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching trips',
        error.message,
      );
    }
  }

  private buildMatchStage(search: any): any {
    const matchStage = {};

    // Process search parameters
    Object.entries(search).forEach(([key, value]) => {
      // Handle different types of search parameters
      if (value !== null && value !== undefined) {
        if (key === '_id') {
          // Special handling for _id field
          try {
            matchStage[key] = new mongoose.Types.ObjectId(value as string);
          } catch (error) {
            console.log(`Invalid ObjectId format for _id: ${value}`);
            // You could either skip this field or use the original value
            // matchStage[key] = value; // Use this if you want to keep the original value
          }
        } else if (typeof value === 'string' && value.trim() !== '') {
          // For string values, use regex for partial matching
          matchStage[key] = { $regex: value, $options: 'i' };
        } else if (key.endsWith('Id')) {
          // For other ID fields, ensure proper ObjectId handling
          try {
            matchStage[key] = new mongoose.Types.ObjectId(value as string);
          } catch (error) {
            matchStage[key] = value;
          }
        } else {
          // For other values, use exact matching
          matchStage[key] = value;
        }
      }
    });

    return matchStage;
  }

  async findOne(id: string): Promise<Trip> {
    try {
      const trip = await this.tripModel
        .findById(id)
        .populate('routeDetails.sourceHub')
        .populate('routeDetails.destinationHub')
        .populate('routeDetails.viaHub')
        .exec();

      if (!trip) {
        throw new NotFoundException(`Trip with ID ${id} not found`);
      }
      return trip;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching trip',
        error.message,
      );
    }
  }

  async update(id: string, updateTripDto: UpdateTripDto): Promise<Trip> {
    try {
      const updatedTrip = await this.tripModel
        .findByIdAndUpdate(id, updateTripDto, { new: true })
        .populate('routeDetails.sourceHub')
        .populate('routeDetails.destinationHub')
        .populate('routeDetails.viaHub')
        .exec();

      if (!updatedTrip) {
        throw new NotFoundException(`Trip with ID ${id} not found`);
      }
      return updatedTrip;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error updating trip',
        error.message,
      );
    }
  }

  async remove(id: string): Promise<Trip> {
    try {
      const deletedTrip = await this.tripModel.findByIdAndDelete(id).exec();

      if (!deletedTrip) {
        throw new NotFoundException(`Trip with ID ${id} not found`);
      }
      return deletedTrip;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error deleting trip',
        error.message,
      );
    }
  }

  async findByStatus(
    status: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ trips: Trip[]; total: number }> {
    try {
      const skip = (page - 1) * limit;

      const [trips, total] = await Promise.all([
        this.tripModel
          .find({ status })
          .populate('routeDetails.sourceHub')
          .populate('routeDetails.destinationHub')
          .populate('routeDetails.viaHub')
          .skip(skip)
          .limit(limit)
          .exec(),
        this.tripModel.countDocuments({ status }).exec(),
      ]);

      return { trips, total };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching trips by status',
        error.message,
      );
    }
  }

  async findByVehicleId(vehid: number): Promise<Trip[]> {
    try {
      return await this.tripModel
        .find({ 'vehicleDetails.vehid': vehid })
        .populate('routeDetails.sourceHub')
        .populate('routeDetails.destinationHub')
        .populate('routeDetails.viaHub')
        .exec();
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching trips by vehicle ID',
        error.message,
      );
    }
  }

  async findByDateRange(
    startDate: Date,
    endDate: Date,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ trips: Trip[]; total: number }> {
    try {
      const skip = (page - 1) * limit;

      const [trips, total] = await Promise.all([
        this.tripModel
          .find({
            startDate: { $gte: startDate },
            endDate: { $lte: endDate },
          })
          .populate('routeDetails.sourceHub')
          .populate('routeDetails.destinationHub')
          .populate('routeDetails.viaHub')
          .skip(skip)
          .limit(limit)
          .exec(),
        this.tripModel
          .countDocuments({
            startDate: { $gte: startDate },
            endDate: { $lte: endDate },
          })
          .exec(),
      ]);

      return { trips, total };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching trips by date range',
        error.message,
      );
    }
  }
  async searchTrips(
    filters: any,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ trips: Trip[]; total: number }> {
    try {
      const pageNum = Number(page);
      const limitNum = Number(limit);
      const skip = (pageNum - 1) * limitNum;

      const matchStage: any = {};

      if (filters._id) {
        if (Types.ObjectId.isValid(filters._id)) {
          matchStage._id = new Types.ObjectId(filters._id);
        } else {
          console.error('Invalid ObjectId:', filters._id);
          throw new BadRequestException('Invalid Trip ID format');
        }
      }

      const { _id, page: _, limit: __, ...otherFilters } = filters;

      for (const [key, value] of Object.entries(otherFilters)) {
        if (value !== undefined && value !== null) {
          matchStage[key] = value;
        }
      }

      const aggregationPipeline = [
        { $match: matchStage },
        {
          $lookup: {
            from: 'geofences',
            localField: 'routeDetails.sourceHub',
            foreignField: '_id',
            as: 'routeDetails.sourceHub',
          },
        },
        {
          $lookup: {
            from: 'geofences',
            localField: 'routeDetails.destinationHub',
            foreignField: '_id',
            as: 'routeDetails.destinationHub',
          },
        },
        {
          $lookup: {
            from: 'geofences',
            localField: 'routeDetails.viaHub',
            foreignField: '_id',
            as: 'routeDetails.viaHub',
          },
        },
        {
          $facet: {
            metadata: [{ $count: 'total' }],
            data: [{ $skip: skip }, { $limit: limitNum }],
          },
        },
      ];

      const [result] = await this.tripModel.aggregate(aggregationPipeline);

      const trips = result?.data || [];
      const total = result?.metadata?.[0]?.total || 0;

      return { trips, total };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching trips',
        error.message,
      );
    }
  }
}
