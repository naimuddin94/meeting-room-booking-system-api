import { Router } from 'express';
import multer from 'multer';
import auth from '../../middleware/auth';
import validateRequest from '../../middleware/validateRequest';
import { USER_ROLE } from '../User/user.constant';
import { RoomController } from './room.controller';
import { RoomValidation } from './room.validation';

const upload = multer();

const router = Router();

router
  .route('/')
  .post(
    auth(USER_ROLE.admin),
    upload.single('image'),
    validateRequest(RoomValidation.createRoomValidationSchema),
    RoomController.createRoom,
  )
  .get(RoomController.fetchAllRooms);

router
  .route('/:id')
  .get(RoomController.fetchSingleRoom)
  .put(
    auth(USER_ROLE.admin),
    validateRequest(RoomValidation.updateRoomValidationSchema),
    RoomController.updateRoom,
  )
  .delete(auth(USER_ROLE.admin), RoomController.deleteRoom);

export const roomRouter = router;
