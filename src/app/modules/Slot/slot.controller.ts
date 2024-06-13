import httpStatus from 'http-status';
import { ApiResponse, asyncHandler } from '../../utils';
import { SlotService } from './slot.service';

const createSlot = asyncHandler(async (req, res) => {
  const result = await SlotService.saveSlotIntoDB(req.body);

  res
    .status(httpStatus.CREATED)
    .json(
      new ApiResponse(httpStatus.CREATED, result, 'Slots created successfully'),
    );
});

export const SlotController = {
  createSlot,
};
