import mongoose from 'mongoose';

export const handleMongooseError = (err: mongoose.Error.ValidationError) => {
  return {
    statusCode: 400,
    message: 'Validation error',
    errors: Object.values(err.errors).map((error) => ({
      path: error?.path,
      message: error?.message,
    })),
  };
};
