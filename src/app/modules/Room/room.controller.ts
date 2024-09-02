import httpStatus from 'http-status';
import { ApiResponse, asyncHandler } from '../../utils';
import { RoomService } from './room.service';

const createRoom = asyncHandler(async (req, res) => {
  const result = await RoomService.saveRoomIntoDB(req);

  res
    .status(httpStatus.CREATED)
    .json(
      new ApiResponse(httpStatus.CREATED, result, 'Room added successfully'),
    );
});

const fetchAllRooms = asyncHandler(async (req, res) => {
  const result = await RoomService.fetchAllRoomsFromDB(req.query);

  res
    .status(httpStatus.OK)
    .json(
      new ApiResponse(httpStatus.OK, result, 'Rooms retrieved successfully'),
    );
});

const fetchSingleRoom = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await RoomService.fetchSingleRoomFromDB(id);

  res
    .status(httpStatus.OK)
    .json(
      new ApiResponse(httpStatus.OK, result, 'Room retrieved successfully'),
    );
});

const updateRoom = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  const result = await RoomService.updateRoomIntoDB(id, updatedData);

  res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, result, 'Room updated successfully'));
});

const deleteRoom = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await RoomService.deleteRoomFromDB(id);

  res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, result, 'Room deleted successfully'));
});

export const RoomController = {
  createRoom,
  fetchAllRooms,
  fetchSingleRoom,
  updateRoom,
  deleteRoom,
};
