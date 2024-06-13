import { Router } from 'express';
import auth from '../../middleware/auth';
import validateRequest from '../../middleware/validateRequest';
import { USER_ROLE } from '../User/user.constant';
import { SlotController } from './slot.controller';
import { SlotValidation } from './slot.validation';

const router = Router();

router
  .route('/')
  .post(
    auth(USER_ROLE.admin),
    validateRequest(SlotValidation.createSlotValidationSchema),
    SlotController.createSlot,
  );

router.route('/availability').get(SlotController.fetchAvailableSlots);

export const slotRouter = router;
