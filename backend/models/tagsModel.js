// backend/models/tagModel.js

import mongoose, { Schema } from "mongoose";

// Define schema for storing tags
const tagSchema = new Schema(
  {
    name: {
      type: String,
      required: true,  // A tag must have a name
      unique: true,    // No duplicate tag names allowed
    },
  },
  {
    timestamps: true,  // Automatically track creation and update times
  }
);

// Export the Mongoose model for tags
export const Tag = mongoose.model("Tag", tagSchema);
