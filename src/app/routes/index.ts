import { Router } from 'express';
import { bookingRouter } from '../modules/Booking/booking.route';
import { roomRouter } from '../modules/Room/room.route';
import { slotRouter } from '../modules/Slot/slot.route';
import { userRouter } from '../modules/User/user.route';
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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
