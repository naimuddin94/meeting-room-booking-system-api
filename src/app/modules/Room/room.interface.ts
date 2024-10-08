/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';
import { z } from 'zod';
import { RoomValidation } from './room.validation';

export interface IRoom
  extends z.infer<typeof RoomValidation.roomValidationSchema> {
  image: string;
  status: 'available' | 'unavailable';
  isDeleted: boolean;
}

export interface IRoomModel extends Model<IRoom> {}
