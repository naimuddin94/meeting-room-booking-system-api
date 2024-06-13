import { Schema, model } from 'mongoose';
import { ISlot } from './slot.interface';

const slotSchema = new Schema<ISlot>(
  {
    room: {
      type: Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    isBooked: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
  },
);

// Query middleware
slotSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

slotSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

slotSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

const Slot = model<ISlot>('Slot', slotSchema);

export default Slot;
