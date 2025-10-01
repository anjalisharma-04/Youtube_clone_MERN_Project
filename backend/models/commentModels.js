// backend/models/commentModels.js

import { Comment } from '../models/commentModels.js'; // ✅ correct

// Define the schema for storing video comments
const commentSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "newUser", // make sure this matches your actual user model name
      required: true,
    },
    userAvatar: {
      type: String,
    },
    videoId: {
      type: Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Comment = mongoose.models.Comment || mongoose.model("Comment", commentSchema);
