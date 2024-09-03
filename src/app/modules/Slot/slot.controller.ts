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

const fetchAvailableSlots = asyncHandler(async (req, res) => {
  const result = await SlotService.fetchAllAvailableSlotsFromDB(req.query);

  res
    .status(httpStatus.OK)
    .json(
      new ApiResponse(httpStatus.OK, result, 'Slots retrieved successfully'),
    );
});

export const SlotController = {
  createSlot,
  fetchAvailableSlots,
};
