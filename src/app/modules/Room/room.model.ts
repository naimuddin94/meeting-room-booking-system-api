import { Schema, model } from 'mongoose';
import { IRoom, IRoomModel } from './room.interface';

const roomSchema = new Schema<IRoom, IRoomModel>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    roomNo: {
      type: Number,
      required: true,
      unique: true,
    },
    floorNo: {
      type: Number,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    pricePerSlot: {
      type: Number,
      required: true,
    },
    amenities: {
      type: [String],
      required: true,
    },
    status: {
      type: String,
      default: 'available',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Room = model<IRoom, IRoomModel>('Room', roomSchema);

export default Room;
