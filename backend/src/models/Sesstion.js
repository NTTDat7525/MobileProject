import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  refreshToken: {
    type: String,
    required: true,
    unique: true,
    sparse: true
  },

  accessToken: {
    type: String,
    default: null
  },

  expiresAt: {
    type: Date,
    required: true,
    index: true
  },

  deviceInfo: {
    userAgent: {
      type: String,
      default: ""
    },
    deviceType: {
      type: String,
      enum: ['mobile', 'tablet', 'desktop'],
      default: 'mobile'
    },
    deviceName: {
      type: String,
      default: ""
    },
    osType: {
      type: String,
      enum: ['iOS', 'Android', 'Windows', 'macOS', 'Linux', 'Other'],
      default: 'Other'
    },
    osVersion: {
      type: String,
      default: ""
    },
    browser: {
      type: String,
      default: ""
    }
  },

  ipAddress: {
    type: String,
    default: null,
    index: true
  },

  isActive: {
    type: Boolean,
    default: true,
    index: true
  },

  location: {
    country: {
      type: String,
      default: null
    },
    city: {
      type: String,
      default: null
    },
    latitude: {
      type: Number,
      default: null
    },
    longitude: {
      type: Number,
      default: null
    }
  },

  lastActivityAt: {
    type: Date,
    default: Date.now
  },

  loginAt: {
    type: Date,
    default: Date.now
  },

  logoutAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

sessionSchema.index({ userId: 1, isActive: 1 });
sessionSchema.index({ refreshToken: 1 });
sessionSchema.index({ lastActivityAt: -1 });
sessionSchema.index({ loginAt: -1 });

const Session = mongoose.model('Session', sessionSchema);

export default Session;