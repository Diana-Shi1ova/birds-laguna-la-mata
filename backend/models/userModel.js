const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      //required: [true, 'Please add a phone number'],
    },
    password: {
      type: String,
      required: [true, 'Please add a password hash'],
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    /*registeredAt: {
      type: Date,
      default: Date.now,
    },*/
    avatar: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true, // createdAt и updatedAt automatic
  }
);

module.exports = mongoose.model('User', userSchema);