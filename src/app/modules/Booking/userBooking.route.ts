import { Router } from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../User/user.constant';
import { BookingController } from './booking.controller';

const router = Router();

router
  .route('/')
  .get(
    auth(USER_ROLE.user, USER_ROLE.admin),
    BookingController.fetchAllOwenBookings,
  );

export const userBookingRouter = router;
