/*
 * Title: Meeting Room
 * Description: A meeting room booking system application.
 * Author: Md Naim Uddin
 * Date: 12/06/2024
 *
 */

import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import router from './app/routes';
import { globalErrorHandler } from './app/utils';

const app: Application = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ['http://localhost:3000'],
    credentials: true,
  }),
);

// Testing route
app.get('/', (req: Request, res: Response) => {
  res.send('server is running 🚀');
});

// Application routes
app.use('/api', router);

// Not-Found routes error handler
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`can't find ${req.originalUrl} on the server`);
  next(error);
});

// Global error handler
app.use(globalErrorHandler);

export default app;
