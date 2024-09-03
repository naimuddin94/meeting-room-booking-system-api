import { Router } from 'express';
import { bookingRouter } from '../modules/Booking/booking.route';
import { userBookingRouter } from '../modules/Booking/userBooking.route';
import { roomRouter } from '../modules/Room/room.route';
import { slotRouter } from '../modules/Slot/slot.route';
import { userRouter } from '../modules/User/user.route';
import { paymentRouter } from '../modules/Payment/payment.route';
const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: userRouter,
  },
  {
    path: '/rooms',
    route: roomRouter,
  },
  {
    path: '/slots',
    route: slotRouter,
  },
  {
    path: '/bookings',
    route: bookingRouter,
  },
  {
    path: '/my-bookings',
    route: userBookingRouter,
  },
  {
    path: '/payments',
    route: paymentRouter,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
