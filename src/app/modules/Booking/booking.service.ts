import { IBooking } from './booking.interface';
import Booking from './booking.model';

const saveBookingIntoDB = async (payload: IBooking) => {
  const result = await Booking.create(payload);
  return result;
};

export const BookingService = {
  saveBookingIntoDB,
};
