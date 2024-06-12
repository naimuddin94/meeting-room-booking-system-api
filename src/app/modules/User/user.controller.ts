import { CookieOptions } from 'express';
import { ApiResponse, asyncHandler, options } from '../../utils';
import { UserService } from './user.service';

const createUser = asyncHandler(async (req, res) => {
  const userData = req.body;
  const result = await UserService.saveUserIntoDB(userData);

  res
    .status(201)
    .json(new ApiResponse(201, result, 'User registered successfully'));
});

const login = asyncHandler(async (req, res) => {
  const { data, token, refreshToken } = await UserService.loginUser(req.body);

  res
    .status(200)
    // .cookie('token', token, options as CookieOptions)
    .cookie('refreshToken', refreshToken, options as CookieOptions)
    .json(new ApiResponse(200, data, 'User logged in successfully', token));
});

const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  await UserService.logoutUser(refreshToken);

  res
    .status(200)
    .clearCookie('refreshToken')
    .json(new ApiResponse(200, null, 'Logout successfully'));
});

export const UserController = {
  createUser,
  login,
  logout,
};
