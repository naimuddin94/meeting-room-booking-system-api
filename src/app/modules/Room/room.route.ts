import { Router } from 'express';
import auth from '../../middleware/auth';
import validateRequest from '../../middleware/validateRequest';
import { USER_ROLE } from '../User/user.constant';
import { RoomController } from './room.controller';
import { RoomValidation } from './room.validation';

const router = Router();

router
  .route('/')
  .post(
    auth(USER_ROLE.admin),
    validateRequest(RoomValidation.createRoomValidationSchema),
    RoomController.createRoom,
  )
  .get(RoomController.fetchAllRooms);

router
  .route('/:id')
  .get(RoomController.fetchSingleRoom)
  .put(
    validateRequest(RoomValidation.updateRoomValidationSchema),
    RoomController.updateRoom,
  );

export const roomRouter = router;
