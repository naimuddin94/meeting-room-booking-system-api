import { Model } from 'mongoose';
import { z } from 'zod';
import { RoomValidation } from './room.validation';

export interface IRoom
  extends z.infer<typeof RoomValidation.roomValidationSchema> {
  status: 'available' | 'unavailable';
  isDeleted: boolean;
}

export interface IRoomModel extends Model<IRoom> {}
