import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import { ApiError } from '../../utils';
import Room from '../Room/room.model';
import { ISlot } from './slot.interface';
import Slot from './slot.model';
import { minutesToTime, timeToMinutes } from './slot.util';

const saveSlotIntoDB = async (payload: ISlot) => {
  const isExistsRoom = await Room.findOne({ _id: payload.room });

  if (!isExistsRoom) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Room not found');
  }

  const startMinutes = timeToMinutes(payload.startTime);
  const endMinutes = timeToMinutes(payload.endTime);
  const slotDuration = 60;

  if (endMinutes <= startMinutes) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'End time must be after start time',
    );
  }

  const totalDuration = endMinutes - startMinutes;
  const numberOfSlots = Math.floor(totalDuration / slotDuration);

  const slots = [];
  for (let i = 0; i < numberOfSlots; i++) {
    const slotStart = startMinutes + i * slotDuration;
    const slotEnd = slotStart + slotDuration;
    slots.push({
      room: payload.room,
      date: payload.date,
      startTime: minutesToTime(slotStart),
      endTime: minutesToTime(slotEnd),
    });
  }

  // Check for overlapping slots
  const overlappingSlots = await Slot.find({
    room: payload.room,
    date: payload.date,
    $or: slots.map((slot) => ({
      $or: [
        { startTime: { $lt: slot.endTime, $gte: slot.startTime } },
        { endTime: { $gt: slot.startTime, $lte: slot.endTime } },
        {
          startTime: { $lte: slot.startTime },
          endTime: { $gte: slot.endTime },
        },
      ],
    })),
  });

  if (overlappingSlots.length > 0) {
    throw new ApiError(
      httpStatus.CONFLICT,
      'One or more slots overlap with existing slots',
    );
  }

  // Save each slot into the database
  const result = await Slot.insertMany(slots);
  return result;
};

const fetchAllAvailableSlotsFromDB = async (query: Record<string, unknown>) => {
  if (query?.date) {
    query.date = new Date(query.date as string);
  }

  if (query?.roomId) {
    query.room = query.roomId as string;
    delete query.roomId;
  }

  const slotQuery = new QueryBuilder(
    Slot.find({ isBooked: false })
      .populate({
        path: 'room',
        select: '-status -createdAt -updatedAt',
      })
      .select('-isDeleted'),
    query,
  )
    .filter()
    .fields()
    .sort();

  const result = await slotQuery.queryModel;

  return result;
};

export const SlotService = {
  saveSlotIntoDB,
  fetchAllAvailableSlotsFromDB,
};
