import { Router } from 'express';
import { UserController } from './user.controller';

const router = Router();

router.route('/').post(UserController.createUser);

export const userRouter = router;
