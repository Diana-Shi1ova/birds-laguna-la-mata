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
    password: {
      type: String,
      required: [true, 'Please add a password hash'],
    },
    lastLogin: {
      type: Date,
      default: null,
    },
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