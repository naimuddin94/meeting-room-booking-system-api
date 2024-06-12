import { Router } from 'express';
import { roomRouter } from '../modules/Room/room.route';
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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
