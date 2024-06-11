import { z } from 'zod';
import { role, status } from './user.constant';

const userValidationSchema = z.object({
  name: z
    .string({
      required_error: 'Name is required',
      invalid_type_error: 'Name must be string',
    })
    .min(2)
    .max(100),
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email({ message: 'Invalid email format' }),
  password: z
    .string({
      required_error: 'Password is required',
    })
    .min(4, { message: 'Password must be at least 4 characters' })
    .max(20, { message: 'Password no longer that 20 characters' }),
  phone: z.string({
    required_error: 'Phone number is required',
  }),
  address: z.string({
    required_error: 'Address is required',
  }),
  role: z.enum([...role] as [string], {
    message: 'Role is required in valid format user or admin',
  }),
  refreshToken: z.string({}).optional(),
  status: z
    .enum([...status] as [string], {
      message: 'Status is required in valid format active or blocked',
    })
    .optional(),
  isDeleted: z
    .boolean({
      invalid_type_error: 'Deleted status must be boolean',
    })
    .default(false),
});

const createUserValidationSchema = z.object({
  body: userValidationSchema,
});

const updateUserValidationSchema = z.object({
  body: userValidationSchema.partial(),
});

export const UserValidation = {
  userValidationSchema,
  createUserValidationSchema,
  updateUserValidationSchema,
};
