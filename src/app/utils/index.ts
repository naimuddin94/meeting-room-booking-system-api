import ApiError from './ApiError';
import ApiResponse from './ApiResponse';
import asyncHandler from './asyncHandler';
import globalErrorHandler from './globalErrorHandler';

// JWT configuration
const options = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
};

export { ApiError, ApiResponse, asyncHandler,globalErrorHandler, options };
