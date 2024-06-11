// types/express.d.ts
import { HydratedDocument } from 'mongoose';
import { IUser, IUserMethods } from './src/app/modules/user/user.interface';

declare module 'express-serve-static-core' {
  interface Request {
    user?: HydratedDocument<IUser, IUserMethods>;
  }
}
