import { Schema, model } from 'mongoose';
import { IRoom } from './room.interface';

const roomSchema = new Schema<IRoom>(
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

const Room = model<IRoom>('User', roomSchema);

export default Room;
