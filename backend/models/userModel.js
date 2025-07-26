// backend/models/userModel.js

import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"; // ✅ Missing import added

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: String,
    hasChannel: {
      type: Boolean,
      default: false,
    },
    channelId: {
      type: Schema.Types.ObjectId,
      ref: "channel",
    },
    subscriptions: [
      {
        type: Schema.Types.ObjectId,
        ref: "channel",
      },
    ],
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
  },
  { timestamps: true }
);

// ✅ Password comparison method
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// ✅ Generate JWT token method
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

export const newUser = mongoose.model("newUser", userSchema);
