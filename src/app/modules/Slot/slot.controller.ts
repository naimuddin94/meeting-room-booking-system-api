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

  let message = 'Available slots retrieved successfully';
  let statusCode = 200;

  if (!result.length) {
    message = 'No Data Found';
    statusCode = 404;
  }

  res.status(statusCode).json(new ApiResponse(statusCode, result, message));
});

export const SlotController = {
  createSlot,
  fetchAvailableSlots,
};
