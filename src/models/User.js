const mongoose = require('../database/index');

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    googleAccount: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      required: true,
    },
    income: {
      type: Number,
      required: true,
    },
    lastAccess: {
      type: Date,
      default: Date.now,
    },
    activeAccount: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    id: true,
    collection: 'User',
  },
)

module.exports = mongoose.model('User', UserSchema)
