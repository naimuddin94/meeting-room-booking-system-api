/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { ApiError } from '../../utils';
import Room from '../Room/room.model';
import Slot from '../Slot/slot.model';
import User from '../User/user.model';
import { IBooking } from './booking.interface';
import Booking from './booking.model';

const saveBookingIntoDB = async (payload: IBooking) => {
  const { date, room, slots, user } = payload;

  const isRoomExist = await Room.findOne({ _id: room });

  if (!isRoomExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Room not found');
  }

  const isUserExist = await User.findOne({
    _id: user,
    status: { $ne: 'blocked' },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (!slots.length) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'You must select one slot');
  }

  // Find slots available on the specified date
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
    (slot: any) =>
      slots.includes(slot._id.toString()) &&
      slot.date.toISOString().split('T')[0] === targetDate &&
      !slot.isBooked &&
      !slot.isDeleted,
  );

  allSlots.forEach((slot: any) => {
    if (slot.room.toString() !== room) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Room id is not matching in slots',
      );
    }
  });

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

    // Mark the selected slots as booked
    await Slot.updateMany(
      {
        _id: { $in: slots },
      },
      { isBooked: true },
      { new: true, session },
    );

    // Create the booking in the database
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

const fetchAllBookingsFromDB = async (query: Record<string, unknown>) => {
  const bookingQuery = new QueryBuilder(
    Booking.find().populate([
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
    ]),
    query,
  )
    .search(['paymentInfo', 'isConfirmed', 'totalAmount'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await bookingQuery.queryModel;
  const meta = await bookingQuery.countTotal();

  return {
    meta,
    result,
  };
};

const fetchAllOwenBookingsFromDB = async (
  id: string,
  query: Record<string, unknown>,
) => {
  const bookingQuery = new QueryBuilder(
    Booking.find({ user: id }).populate([
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
    ]),
    query,
  )
    .search(['paymentInfo', 'isConfirmed', 'totalAmount'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await bookingQuery.queryModel;
  const meta = await bookingQuery.countTotal();

  return {
    meta,
    result,
  };
};

const updateBookingStatusIntoDB = async (
  id: string,
  payload: Pick<IBooking, 'isConfirmed'>,
) => {
  const isExistBooking = await Booking.findOne({ _id: id });

  if (!isExistBooking) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Booking not found');
  }
  const { isConfirmed } = payload;
  const result = await Booking.findByIdAndUpdate(
    id,
    { isConfirmed },
    {
      new: true,
    },
  );
  return result;
};

const deleteBookingFromDB = async (id: string) => {
  const result = await Booking.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );

  return result;
};

export const BookingService = {
  saveBookingIntoDB,
  fetchAllBookingsFromDB,
  fetchAllOwenBookingsFromDB,
  updateBookingStatusIntoDB,
  deleteBookingFromDB,
};
