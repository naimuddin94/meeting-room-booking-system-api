import { ApiResponse, asyncHandler } from '../../utils';
import { UserService } from './user.service';

const createUser = asyncHandler(async (req, res) => {
  const userData = req.body;
  const result = await UserService.saveUserIntoDB(userData);

  res
    .status(201)
    .json(new ApiResponse(201, result, 'User registered successfully'));
});

const login = asyncHandler(async (req, res) => {
  console.log(14, req.body);
  const result = await UserService.loginUser(req.body);

  res
    .status(200)
    .json(new ApiResponse(200, result, 'User logged in successfully'));
});

export const UserController = {
  createUser,
  login,
};
