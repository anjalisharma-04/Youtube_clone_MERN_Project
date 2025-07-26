// backend/models/channelModel.js

import mongoose, { Schema } from "mongoose";

// Define the schema for a Channel
const channelSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    handle: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    banner: {
      type: String // URL or file path for the banner image
    },
    avatar: {
      type: String // URL or file path for the avatar
    },
    description: {
      type: String,
      trim: true
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "newUser",
      required: true
    },
    subscribers: [
      {
        type: Schema.Types.ObjectId,
        ref: "newUser"
      }
    ],
    videos: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video"
      }
    ]
  },
  {
    timestamps: true // Adds createdAt and updatedAt automatically
  }
);

// ✅ Safe export to avoid OverwriteModelError
export const Channel = mongoose.models.Channel || mongoose.model("Channel", channelSchema);
