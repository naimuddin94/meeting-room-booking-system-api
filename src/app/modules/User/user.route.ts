import { Router } from 'express';
import multer from 'multer';
import validateRequest from '../../middleware/validateRequest';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';

const upload = multer();

const router = Router();

router
  .route('/signup')
  .post(
    upload.single('image'),
    validateRequest(UserValidation.createUserValidationSchema),
    UserController.createUser,
  );

router
  .route('/signin')
  .post(
    validateRequest(UserValidation.loginUserValidationSchema),
    UserController.login,
  );

router.route('/signout').post(UserController.logout);

export const userRouter = router;
