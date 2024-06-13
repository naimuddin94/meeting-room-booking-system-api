import httpStatus from 'http-status';
import { ApiResponse, asyncHandler } from '../../utils';
import { BookingService } from './booking.service';

const createBooking = asyncHandler(async (req, res) => {
  const result = await BookingService.saveBookingIntoDB(req.body);

  res
    .status(httpStatus.CREATED)
    .json(
      new ApiResponse(
        httpStatus.CREATED,
        result,
        'Booking created successfully',
      ),
    );
});

export const BookingController = {
  createBooking,
};
