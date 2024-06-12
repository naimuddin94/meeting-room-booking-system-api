import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';
import { asyncHandler } from '../utils';

const validateRequest = (schema: AnyZodObject) => {
  return asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await schema.parseAsync({
      body: req.body,
      cookies: req.cookies,
    });

    next();
  });
};

export default validateRequest;
