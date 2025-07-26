// backend/controllers/commentsController.js

import { Comment } from '../models/CommentModel.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

// 🔍 Fetch all comments associated with a video
export const getCommentsByVideoId = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const comments = await Comment.find({ videoId });

  res.status(200).json(
    new ApiResponse(200, comments, 'Comments retrieved successfully')
  );
});

// 📝 Post a new comment on a video
export const addComment = asyncHandler(async (req, res) => {
  const { comment } = req.body;

  if (!comment?.trim()) {
    throw new ApiError(400, 'Comment content cannot be empty');
  }

  const createdComment = await Comment.create({
    text: comment,
    userName: req.user.name,
    userId: req.user._id,
    userAvatar: req.user.avatar,
    videoId: req.params.videoId,
  });

  res.status(201).json(
    new ApiResponse(201, createdComment, 'Comment posted successfully')
  );
});

// ❌ Remove a comment
export const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, 'Comment does not exist');
  }

  if (comment.userId.toString() !== req.user.id) {
    throw new ApiError(403, 'You are not allowed to delete this comment');
  }

  await comment.deleteOne();

  res.status(200).json(
    new ApiResponse(200, {}, 'Comment deleted successfully')
  );
});

// ✏️ Edit an existing comment
export const updateComment = asyncHandler(async (req, res) => {
  const { newComment } = req.body;
  const { commentId } = req.params;

  if (!newComment?.trim()) {
    throw new ApiError(400, 'New comment text is required');
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, 'Comment not found');
  }

  if (comment.userId.toString() !== req.user.id) {
    throw new ApiError(403, 'Unauthorized to update this comment');
  }

  comment.text = newComment;
  await comment.save();

  res.status(200).json(
    new ApiResponse(200, comment, 'Comment updated successfully')
  );
});
