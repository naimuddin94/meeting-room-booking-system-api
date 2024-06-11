/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from 'express';

interface CustomError extends Error {
  status?: number;
  data?: any;
  errors?: string[];
}

const globalErrorHandler = (
  err: CustomError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  // format error
  res.status(err.status || 500).json({
    success: false,
    data: err.data || null,
    message: err.message,
    errors: err.errors,
  });
};

export default globalErrorHandler;
