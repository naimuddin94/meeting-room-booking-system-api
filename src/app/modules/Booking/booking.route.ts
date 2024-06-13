import { Router } from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../User/user.constant';
import { BookingController } from './booking.controller';

const router = Router();

router
  .route('/')
  .post(auth(USER_ROLE.user, USER_ROLE.admin), BookingController.createBooking);

export const bookingRouter = router;
