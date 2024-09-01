/* eslint-disable no-unused-vars */
import { HydratedDocument, Model } from 'mongoose';
import { z } from 'zod';
import { UserValidation } from './user.validation';

export interface IUser
  extends z.infer<typeof UserValidation.userValidationSchema> {
  passwordChangedAt: Date;
  image: string;
  isDeleted: boolean;
  status: 'active' | 'blocked';
  refreshToken: string;
}

export interface IUserMethods {
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

export interface IUserModel
  extends Model<IUser, Record<string, never>, IUserMethods> {
  isUserExists(email: string): Promise<HydratedDocument<IUser, IUserMethods>>;
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean;
}

export interface ILoginPayload {
  email: string;
  password: string;
}

export type TUserRole = 'user' | 'admin';
