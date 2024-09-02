import { z } from 'zod';

const roomValidationSchema = z.object({
  name: z
    .string({
      required_error: 'Room name is required',
      invalid_type_error: 'Room name must be string',
    })
    .min(3, { message: 'Room name must be at least 3 characters' })
    .max(30, { message: 'Room name no longer than 30 characters' }),
  roomNo: z.preprocess((arg: unknown) => {
    if (typeof arg === 'string') {
      return Number(arg);
    }
    return arg;
  }, z.number()),
  floorNo: z.preprocess((arg: unknown) => {
    if (typeof arg === 'string') {
      return Number(arg);
    }
    return arg;
  }, z.number()),
  capacity: z.preprocess((arg: unknown) => {
    if (typeof arg === 'string') {
      return Number(arg);
    }
    return arg;
  }, z.number()),
  pricePerSlot: z.preprocess((arg: unknown) => {
    if (typeof arg === 'string') {
      return Number(arg);
    }
    return arg;
  }, z.number()),
  amenities: z.array(z.string()),
});

const createRoomValidationSchema = z.object({
  body: roomValidationSchema,
});

const updateRoomValidationSchema = z.object({
  body: roomValidationSchema.partial(),
});

export const RoomValidation = {
  roomValidationSchema,
  createRoomValidationSchema,
  updateRoomValidationSchema,
};
