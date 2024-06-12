import { ApiResponse, asyncHandler } from '../../utils';
import { UserService } from './user.service';

const createUser = asyncHandler(async (req, res) => {
  const userData = req.body;
  const result = await UserService.saveUserIntoDB(userData);

  res
    .status(201)
    .json(new ApiResponse(201, result, 'User registered successfully'));
});

export const UserController = {
  createUser,
};
