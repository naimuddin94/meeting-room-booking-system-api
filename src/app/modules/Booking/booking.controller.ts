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
  const result = await BookingService.fetchAllBookingsFromDB(req.query);

  res
    .status(httpStatus.OK)
    .json(
      new ApiResponse(httpStatus.OK, result, 'Booking retrieved successfully'),
    );
});

const fetchAllOwenBookings = asyncHandler(async (req, res) => {
  const result = await BookingService.fetchAllOwenBookingsFromDB(
    req.user.id,
    req.query,
  );

  res
    .status(httpStatus.OK)
    .json(
      new ApiResponse(httpStatus.OK, result, 'Booking retrieved successfully'),
    );
});

const updateBookingStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await BookingService.updateBookingStatusIntoDB(id, req.body);

  res
    .status(httpStatus.OK)
    .json(
      new ApiResponse(httpStatus.OK, result, 'Booking updated successfully'),
    );
});

const deleteBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await BookingService.deleteBookingFromDB(id);

  res
    .status(httpStatus.OK)
    .json(
      new ApiResponse(httpStatus.OK, result, 'Booking deleted successfully'),
    );
});

export const BookingController = {
  createBooking,
  fetchAllBookings,
  fetchAllOwenBookings,
  updateBookingStatus,
  deleteBooking,
};
