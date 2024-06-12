import { Router } from 'express';
import validateRequest from '../../middleware/validateRequest';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';

const router = Router();

router
  .route('/signup')
  .post(
    validateRequest(UserValidation.createUserValidationSchema),
    UserController.createUser,
  );

router
  .route('/login')
  .post(
    validateRequest(UserValidation.loginUserValidationSchema),
    UserController.login,
  );

router.route('/logout').post(UserController.logout);

export const userRouter = router;
