import { Router } from 'express';
import { UserController } from './user.controller';

const router = Router();

router.route('/signup').post(UserController.createUser);

export const userRouter = router;
