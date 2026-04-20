import mongoose, { Document, Schema } from 'mongoose';
import Event from './event.model';

// Interface for the Booking document
export interface IBooking extends Document {
  eventId: Schema.Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// Booking schema definition
const bookingSchema = new Schema<IBooking>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v: string) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: 'Invalid email format',
      },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Pre-save hook to verify that the referenced event exists
bookingSchema.pre<IBooking>('save', async function (next) {
  try {
    const event = await Event.findById(this.eventId);
    if (!event) {
      return next(new Error('Referenced event does not exist'));
    }
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Add index on eventId for faster queries
bookingSchema.index({ eventId: 1 });

// Create and export the Booking model
const Booking = mongoose.model<IBooking>('Booking', bookingSchema);
export default Booking;