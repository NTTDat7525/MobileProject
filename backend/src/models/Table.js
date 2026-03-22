import mongoose from "mongoose";

const tableSchema = new mongoose.Schema({
  tableNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

  capacity: {
    type: Number,
    required: true,
    min: 1,
    max: 20
  },

  type: {
    type: String,
    enum: ['standard', 'vip', 'bar', 'outdoor'],
    required: true,
    default: 'standard'
  },

  location: {
    type: String,
    required: true,
    enum: ['indoor', 'outdoor', 'terrace']
  },

  description: {
    type: String,
    default: ""
  },

  status: {
    type: String,
    enum: ['available', 'occupied', 'reserved', 'maintenance'],
    default: 'available'
  },

  currentBookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    default: null
  },

  features: {
    hasWindow: {
      type: Boolean,
      default: false
    },
    hasView: {
      type: Boolean,
      default: false
    },
    isHighChairs: {
      type: Boolean,
      default: false
    },
    wheelchair: {
      type: Boolean,
      default: false
    }
  },

  surchargePercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 50
  },

  lastCleaned: {
    type: Date,
    default: null
  },

  maintenanceNotes: {
    type: String,
    default: ""
  }
}, {
  timestamps: true
});

tableSchema.index({ status: 1 });
tableSchema.index({ capacity: 1 });
tableSchema.index({ type: 1 });
tableSchema.index({ currentBookingId: 1 });

const Table = mongoose.model('Table', tableSchema);

export default Table;