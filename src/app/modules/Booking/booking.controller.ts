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

const fetchAllBookings = asyncHandler(async (req, res) => {
  const result = await BookingService.fetchAllBookingsFromDB();

  let message = 'All bookings retrieved successfully';
  let statusCode = 200;

  if (!result.length) {
    message = 'No Data Found';
    statusCode = 404;
  }

  res.status(statusCode).json(new ApiResponse(statusCode, result, message));
});

export const BookingController = {
  createBooking,
  fetchAllBookings,
};
