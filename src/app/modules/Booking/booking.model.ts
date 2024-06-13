import { Schema, model } from 'mongoose';
import { confirmedStatus } from './booking.constant';
import { IBooking, IBookingModel } from './booking.interface';

const bookingSchema = new Schema<IBooking, IBookingModel>(
  {
    date: {
      type: Date,
      required: true,
    },
    slots: {
      type: [Schema.Types.ObjectId],
      ref: 'Slot',
      required: true,
    },
    room: {
      type: Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    isConfirmed: {
      type: String,
      enum: confirmedStatus,
      default: 'unconfirmed',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false },
);

const Booking = model<IBooking, IBookingModel>('Booking', bookingSchema);

export default Booking;
