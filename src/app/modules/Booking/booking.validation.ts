import { Types } from 'mongoose';
import { z } from 'zod';
import { confirmedStatus } from './booking.constant';

const bookingValidationSchema = z.object({
  date: z.preprocess(
    (arg: unknown) => {
      if (typeof arg === 'string') {
        return new Date(arg);
      }
      return arg;
    },
    z.date({
      required_error: 'Date is required',
      invalid_type_error: 'Invalid date format',
    }),
  ),
  room: z.preprocess((arg: unknown) => {
    if (typeof arg === 'string') {
      return new Types.ObjectId(arg);
    }
    return arg;
  }, z.instanceof(Types.ObjectId)),
  slots: z.array(
    z.preprocess((arg: unknown) => {
      if (typeof arg === 'string') {
        return new Types.ObjectId(arg);
      }
      return arg;
    }, z.instanceof(Types.ObjectId)),
  ),
  user: z.preprocess((arg: unknown) => {
    if (typeof arg === 'string') {
      return new Types.ObjectId(arg);
    }
    return arg;
  }, z.instanceof(Types.ObjectId)),
  totalAmount: z.number().optional(),
  isConfirmed: z.enum([...confirmedStatus] as [string]).optional(),
  isDeleted: z.boolean().optional(),
  paymentInfo: z.string(),
});

const createBookingValidationSchema = z.object({
  body: bookingValidationSchema,
});

const updateBookingValidationSchema = z.object({
  body: bookingValidationSchema.partial(),
});

export const BookingValidation = {
  bookingValidationSchema,
  createBookingValidationSchema,
  updateBookingValidationSchema,
};
