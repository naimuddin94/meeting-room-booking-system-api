/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import httpStatus from 'http-status';
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

  

  return user;
};

export const UserService = {
  saveUserIntoDB,
  loginUser,
};
