/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import { omitField } from '../../lib/omitField';
import { ApiError } from '../../utils';
import { ILoginPayload, IUser } from './user.interface';
import User from './user.model';

const saveUserIntoDB = async (payload: IUser) => {
  const isUserExists = await User.isUserExists(payload.email);

  if (isUserExists) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already exists!');
  }

  const result = await User.create(payload);

  if (!result) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Something went wrong while creating the user',
    );
  }

  const userResponse = omitField(result.toObject(), [
    'password',
    'createdAt',
    'updatedAt',
    'status',
  ]);

  return userResponse;
};

const loginUser = async (payload: ILoginPayload) => {
  const user = await User.isUserExists(payload.email);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  if (user.isDeleted) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User is deleted');
  }

  if (user.status === 'blocked') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User is blocked');
  }

  const isPasswordCorrect = await user.isPasswordCorrect(payload.password);

  if (!isPasswordCorrect) {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'Invalid credentials');
  }

  const token = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save();

  const data = omitField(user.toObject(), [
    'password',
    'createdAt',
    'updatedAt',
    'refreshToken',
    'status',
    'isDeleted',
  ]);

  return { token, refreshToken, data };
};

const logoutUser = async (refreshToken: string) => {
  // checking if the token is missing
  if (!refreshToken) {
    throw new ApiError(
      httpStatus.SERVICE_UNAVAILABLE,
      'You already have no credentials!',
    );
  }

  // checking if the given token is valid
  const decoded = jwt.verify(
    refreshToken,
    config.refresh_token_secret!,
  ) as JwtPayload;

  const { id } = decoded;

  const user = await User.findById(id);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  user.refreshToken = '';
  await user.save();

  return null;
};

export const UserService = {
  saveUserIntoDB,
  loginUser,
  logoutUser,
};
