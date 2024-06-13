import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { ApiError } from '../../utils';
import Room from '../Room/room.model';
import Slot from '../Slot/slot.model';
import { IBooking } from './booking.interface';
import Booking from './booking.model';

const saveBookingIntoDB = async (payload: IBooking) => {
  const { date, room, slots } = payload;

  const isRoomExist = await Room.findById(room);

  if (!isRoomExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Room not found');
  }

  if (!slots.length) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'You must select one slot');
  }

  const availableSlotsQueryDate = await Slot.find({ date: new Date(date) });

  if (!availableSlotsQueryDate.length) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'There are no found slots in this date',
    );
  }

  // Convert the date to a string for accurate comparison
  const targetDate = new Date(date).toISOString().split('T')[0];

  const allSlots = availableSlotsQueryDate.filter(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (slot: any) =>
      slots.includes(slot._id.toString()) &&
      slot.date.toISOString().split('T')[0] === targetDate &&
      !slot.isBooked,
  );

  if (allSlots.length !== slots.length) {
    throw new ApiError(
      httpStatus.CONFLICT,
      `There are ${slots.length - allSlots.length} slots is conflicting with booked or deleted slots`,
    );
  }

  if (!allSlots.length) {
    throw new ApiError(httpStatus.NOT_FOUND, 'There are no slots found');
  }

  payload.totalAmount = isRoomExist.pricePerSlot * slots.length;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    await Slot.updateMany(
      {
        _id: { $in: slots },
      },
      { isBooked: true },
      { new: true, session },
    );

    const newBooking = await Booking.create([payload], { session });

    await session.commitTransaction();
    await session.endSession();

    const result = await Booking.findById(newBooking[0]._id).populate([
      {
        path: 'room',
        select: '-status -createdAt -updatedAt',
      },
      {
        path: 'slots',
        select: '-isDeleted',
      },
      {
        path: 'user',
        select: '-status -createdAt -updatedAt -refreshToken -isDeleted',
      },
    ]);

    return result;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Something went wrong during creating booking',
    );
  }
};

export const BookingService = {
  saveBookingIntoDB,
};
