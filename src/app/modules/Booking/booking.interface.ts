import { Model } from 'mongoose';
import { z } from 'zod';
import { BookingValidation } from './booking.validation';

export interface IBooking
  extends z.infer<typeof BookingValidation.bookingValidationSchema> {}

export interface IBookingModel extends Model<IBooking> {}
