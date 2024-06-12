import httpStatus from 'http-status';
import { ApiError } from '../../../utils';
import { IUser } from './user.interface';
import User from './user.model';

const saveUserIntoDB = async (payload: IUser) => {
  const isUserExists = await User.isUserExists(payload.email);

  if (isUserExists) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already exists!');
  }

  const result = await User.create(payload);
  return result;
};

export const UserService = {
  saveUserIntoDB,
};
