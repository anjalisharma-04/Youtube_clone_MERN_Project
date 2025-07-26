// backend/models/videoModel.js

import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

// Define schema for video documents
const videoSchema = new Schema(
  {
    videoFile: {
      type: String,
      required: true,
    },

    thumbnail: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    duration: {
      type: Number,
      default: 0,
    },

    views: {
      type: Number,
      default: 0,
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "newUser",
      required: true,
    },

    channelId: {
      type: Schema.Types.ObjectId,
      ref: "Channel",
    },

    tags: [
      {
        type: String,
      },
    ],

    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "newUser",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Instance method to update views count
videoSchema.methods.incrementViews = async function () {
  this.views += 1;
  await this.save();
};

// Enable pagination for aggregate queries
videoSchema.plugin(mongooseAggregatePaginate);

// Export the model
export const Video = mongoose.model("Video", videoSchema);
