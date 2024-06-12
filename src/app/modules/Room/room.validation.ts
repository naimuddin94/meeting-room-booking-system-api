import { z } from 'zod';

const roomValidationSchema = z.object({
  name: z
    .string({
      required_error: 'Room name is required',
      invalid_type_error: 'Room name must be string',
    })
    .min(3, { message: 'Room name must be at least 3 characters' })
    .max(30, { message: 'Room name no longer than 30 characters' }),
  roomNo: z.number({
    required_error: 'Room number is required',
    invalid_type_error: 'Room number must be valid number',
  }),
  floorNo: z.number({
    required_error: 'Floor number is required',
    invalid_type_error: 'Floor number must be valid number',
  }),
  capacity: z.number({
    required_error: 'Capacity is required',
    invalid_type_error: 'Capacity must be valid number',
  }),
  pricePerSlot: z.number({
    required_error: 'Price is required',
    invalid_type_error: 'Price must be valid number',
  }),
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
