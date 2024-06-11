import { Handler, NextFunction, Request, Response } from 'express';

const asyncHandler =
  (requestHandler: Handler) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };

export default asyncHandler;
