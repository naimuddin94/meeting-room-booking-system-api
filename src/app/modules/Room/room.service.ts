import httpStatus from 'http-status';
import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { omitField } from '../../lib/omitField';
import { ApiError } from '../../utils';
import Slot from '../Slot/slot.model';
import { roomSearchableFields } from './room.constant';
import { IRoom } from './room.interface';
import Room from './room.model';

const saveRoomIntoDB = async (payload: IRoom) => {
  const isExistsRoomName = await Room.findOne({ name: payload.name });

  if (isExistsRoomName) {
    throw new ApiError(httpStatus.CONFLICT, 'This room name already exists');
  }

  const isExistsRoomNo = await Room.findOne({
    roomNo: Number(payload.roomNo),
    floorNo: Number(payload.floorNo),
  });

  if (isExistsRoomNo) {
    throw new ApiError(httpStatus.CONFLICT, 'This room number already exists');
  }
  const result = await Room.create(payload);

  return result;
};

const fetchAllRoomsFromDB = async (query: Record<string, unknown>) => {
  const roomQuery = new QueryBuilder(Room.find(), query)
    .search(roomSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await roomQuery.queryModel;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response = result.map((room: any) => {
    return omitField(room.toObject(), ['status', 'createdAt', 'updatedAt']);
  });

  return response;
};

const fetchSingleRoomFromDB = async (id: string) => {
  const result = await Room.findById(id).select(
    '-status -createdAt -updatedAt',
  );

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Room not found');
  }

  return result;
};

const updateRoomIntoDB = async (id: string, payload: Partial<IRoom>) => {
  const { amenities, ...remainUpdateData } = payload;

  const isRoomExists = await Room.findById(id);
  if (!isRoomExists) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Room not found');
  }

  if (remainUpdateData.name || remainUpdateData.roomNo) {
    const query = {
      _id: { $ne: id },
      roomNo: remainUpdateData.roomNo,
      floorNo: isRoomExists.floorNo,
    };

    if (remainUpdateData?.floorNo) {
      query.floorNo = remainUpdateData.floorNo;
    }
    
    const isExistsRoomNo = await Room.findOne(query);

    if (isExistsRoomNo) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'This room number is already in use',
      );
    }

    const isExistsRoomName = await Room.findOne({
      _id: { $ne: id },
      name: remainUpdateData.name,
    });

    if (isExistsRoomName) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'This room name is already in use',
      );
    }
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    if (remainUpdateData) {
      const basicUpdateResult = await Room.findByIdAndUpdate(
        id,
        remainUpdateData,
        {
          new: true,
          session,
        },
      );

      if (!basicUpdateResult) {
        throw new ApiError(
          httpStatus.INTERNAL_SERVER_ERROR,
          'Something went wrong when updating basic room information',
        );
      }
    }

    if (amenities && amenities.length > 0) {
      const amenitiesUpdateResult = await Room.findByIdAndUpdate(
        id,
        {
          $addToSet: { amenities: { $each: amenities } },
        },
        {
          new: true,
          session,
        },
      );

      if (!amenitiesUpdateResult) {
        throw new ApiError(
          httpStatus.INTERNAL_SERVER_ERROR,
          'Something went wrong when updating the amenities',
        );
      }
    }

    await session.commitTransaction();
    await session.endSession();

    const result = await Room.findById(id).select(
      '-status -createdAt -updatedAt',
    );

    return result;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Something went wrong during updating room',
    );
  }
};

const deleteRoomFromDB = async (id: string) => {
  // const roomSlots = await Slot.find({ room: id });

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    await Slot.updateMany({ room: id }, { isDeleted: true }, { session });

    const result = await Room.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session },
    );

    await session.commitTransaction();
    await session.endSession();

    return result;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Something went wrong during deleting room',
    );
  }
};

export const RoomService = {
  saveRoomIntoDB,
  fetchAllRoomsFromDB,
  fetchSingleRoomFromDB,
  updateRoomIntoDB,
  deleteRoomFromDB,
};
