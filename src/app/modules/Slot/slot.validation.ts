import { Types } from 'mongoose';
import { z } from 'zod';

const timeStringSchema = z.string().refine(
  (time) => {
    const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/; // 00-09 10-19 20-23
    return regex.test(time);
  },
  {
    message: 'Invalid time format , expected "HH:MM" in 24 hours format',
  },
);

const slotValidationSchema = z.object({
  room: z.preprocess((arg: unknown) => {
    if (typeof arg === 'string') {
      return new Types.ObjectId(arg);
    }
    return arg;
  }, z.instanceof(Types.ObjectId)),
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
  startTime: timeStringSchema,
  endTime: timeStringSchema,
  isBooked: z.boolean().optional(),
  isDeleted: z.boolean().optional(),
});

const createSlotValidationSchema = z.object({
  body: slotValidationSchema.refine(
    (data) => {
      const start = new Date(`1970-01-01T${data.startTime}:00`);
      const end = new Date(`1970-01-01T${data.endTime}:00`);

      return end > start;
    },
    {
      message: 'Start time should be before End time !',
    },
  ),
});

const updateSlotValidationSchema = z.object({
  body: slotValidationSchema.partial().refine(
    (data) => {
      const start = new Date(`1970-01-01T${data.startTime}:00`);
      const end = new Date(`1970-01-01T${data.endTime}:00`);

      return end > start;
    },
    {
      message: 'Start time should be before End time !',
    },
  ),
});

export const SlotValidation = {
  slotValidationSchema,
  createSlotValidationSchema,
  updateSlotValidationSchema,
};
