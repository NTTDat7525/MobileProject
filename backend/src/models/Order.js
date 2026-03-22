import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    sparse: true,
    index: true
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },

  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true,
    index: true
  },

  tableId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Table",
    required: true
  },

  items: [
    {
      foodId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Food",
        required: true
      },
      foodName: {
        type: String,
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      },
      unitPrice: {
        type: Number,
        required: true,
        min: 0
      },
      specialInstructions: {
        type: String,
        default: ""
      },
      addedAt: {
        type: Date,
        default: Date.now
      }
    }
  ],

  subtotal: {
    type: Number,
    required: true,
    min: 0
  },

  tax: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },

  serviceCharge: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },

  discount: {
    type: Number,
    default: 0,
    min: 0
  },

  discountReason: {
    type: String,
    default: ""
  },

  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },

  paymentMethod: {
    type: String,
    enum: ['cash', 'credit_card', 'debit_card', 'mobile_wallet', 'bank_transfer'],
    required: true,
    index: true
  },

  paymentStatus: {
    type: String,
    enum: ['unpaid', 'paid', 'partial', 'refunded'],
    default: 'unpaid',
    index: true
  },

  paidAmount: {
    type: Number,
    default: 0,
    min: 0
  },

  paymentDate: {
    type: Date,
    default: null
  },

  transactionId: {
    type: String,
    default: null
  },

  status: {
    type: String,
    enum: ['pending', 'preparing', 'ready', 'served', 'completed', 'cancelled'],
    default: 'pending',
    index: true
  },

  orderedAt: {
    type: Date,
    default: Date.now
  },

  startedAt: {
    type: Date,
    default: null
  },

  completedAt: {
    type: Date,
    default: null
  },

  notes: {
    type: String,
    default: ""
  },

  internalNotes: {
    type: String,
    default: ""
  },

  invoiceNumber: {
    type: String,
    default: null
  },

  cancellationReason: {
    type: String,
    default: null
  },

  loyaltyPointsUsed: {
    type: Number,
    default: 0
  },

  loyaltyPointsEarned: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ bookingId: 1 });
orderSchema.index({ tableId: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ paymentMethod: 1 });
orderSchema.index({ orderedAt: 1 });

const Order = mongoose.model("Order", orderSchema);

export default Order;