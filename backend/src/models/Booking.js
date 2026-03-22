import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },

  guestName: {
    type: String,
    required: true,
    trim: true
  },

  guestEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },

  guestPhone: {
    type: String,
    required: true,
    trim: true
  },

  numberOfGuests: {
    type: Number,
    required: true,
    min: 1,
    max: 30
  },

  tableId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Table",
    required: true,
    index: true
  },

  bookingDate: {
    type: Date,
    required: true
  },

  checkInTime: {
    type: Date,
    default: null
  },

  checkOutTime: {
    type: Date,
    default: null
  },

  estimatedDuration: {
    type: Number,
    default: 120,
    min: 30,
    max: 480
  },

  specialRequests: {
    type: String,
    default: ""
  },

  dietaryRestrictions: {
    type: [String],
    default: []
  },

  occasion: {
    type: String,
    enum: ['regular', 'birthday', 'anniversary', 'business', 'other'],
    default: 'regular'
  },

  status: {
    type: String,
    enum: ['pending', 'confirmed', 'checked-in', 'completed', 'cancelled'],
    default: 'pending',
    index: true
  },

  cancellationReason: {
    type: String,
    default: null
  },

  cancellationDate: {
    type: Date,
    default: null
  },

  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    default: null
  },

  internalNotes: {
    type: String,
    default: ""
  },

  reminderSent: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

bookingSchema.index({ userId: 1, bookingDate: -1 });
bookingSchema.index({ tableId: 1, bookingDate: 1 });
bookingSchema.index({ status: 1, bookingDate: 1 });
bookingSchema.index({ bookingDate: 1 });
bookingSchema.index({ createdAt: -1 });

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;