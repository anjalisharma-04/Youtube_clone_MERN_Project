// backend/controllers/videoController.js

import { Video } from "../models/videoModel.js";
import { Channel } from "../models/channelModel.js";
import { newUser } from "../models/userModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Tag } from "../models/tagsModel.js";
import mongoose from "mongoose";

// Upload and publish video
export const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description, tags } = req.body;
  const thumbnailFile = req?.files?.thumbnail?.[0];
  const videoFile = req?.files?.videoFile?.[0];

  if (!title || !description || !thumbnailFile || !videoFile) {
    throw new ApiError(400, "Title, description, thumbnail, and video file are all required.");
  }

  const [uploadedThumbnail, uploadedVideo] = await Promise.all([
    uploadOnCloudinary(thumbnailFile.path),
    uploadOnCloudinary(videoFile.path),
  ]);

  if (!uploadedThumbnail || !uploadedVideo) {
    throw new ApiError(400, "Failed to upload files to Cloudinary.");
  }

  const tagList = tags ? tags.split(",").map(tag => tag.trim().toLowerCase()) : [];

  for (const tag of tagList) {
    const exists = await Tag.findOne({ name: tag });
    if (!exists) await Tag.create({ name: tag });
  }

  const newVideo = await Video.create({
    title,
    description,
    thumbnail: uploadedThumbnail.url,
    videoFile: uploadedVideo.url,
    owner: req.user._id,
    channelId: req.user.channelId,
    views: 0,
    tags: tagList,
  });

  const channel = await Channel.findById(req.user.channelId);
  if (!channel) throw new ApiError(404, "Associated channel not found.");

  channel.videos.push(newVideo._id);
  await channel.save();

  res.status(201).json(new ApiResponse(201, newVideo, "Video published successfully."));
});

// Fetch all videos
export const getAllVideos = asyncHandler(async (req, res) => {
  const videos = await Video.find()
    .populate("channelId")
    .populate("owner", "-password");

  res.status(200).json(new ApiResponse(200, videos, "Fetched all videos."));
});

// Fetch videos uploaded by a specific user
export const getAllUserVideos = asyncHandler(async (req, res) => {
  const { owner } = req.params;
  if (!owner) throw new ApiError(400, "Owner ID is required.");

  const videos = await Video.find({ owner })
    .populate("channelId")
    .populate("owner", "-password");

  res.status(200).json(new ApiResponse(200, videos, "Fetched user's videos."));
});

// Delete video
export const deleteVideoById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const video = await Video.findById(id);
  if (!video) throw new ApiError(404, "Video not found.");

  if (video.owner.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to delete this video.");
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    await Channel.updateOne(
      { _id: video.channelId },
      { $pull: { videos: video._id } },
      { session }
    );

    await newUser.updateMany(
      { likes: video._id },
      { $pull: { likes: video._id } },
      { session }
    );

    await Video.findByIdAndDelete(id, { session });

    await session.commitTransaction();
    res.status(200).json(new ApiResponse(200, null, "Video deleted successfully."));
  } catch (err) {
    await session.abortTransaction();
    throw new ApiError(500, "Something went wrong while deleting the video.");
  } finally {
    session.endSession();
  }
});

// Get video by ID
export const VideoDataById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const video = await Video.findById(id)
    .populate("owner", "-password")
    .populate("channelId");

  if (!video) throw new ApiError(404, "Video not found.");

  res.status(200).json(new ApiResponse(200, video, "Video details fetched successfully."));
});

// Increment video views
export const viewsIncrement = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const video = await Video.findById(id);
  if (!video) throw new ApiError(404, "Video not found.");

  video.views += 1;
  await video.save();

  res.status(200).json(new ApiResponse(200, video, "View count updated."));
});

// Like a video
export const likeVideo = asyncHandler(async (req, res) => {
  const { videoId, userId } = req.body;

  const [video, user] = await Promise.all([
    Video.findById(videoId),
    newUser.findById(userId),
  ]);

  if (!video || !user) throw new ApiError(404, "User or video not found.");

  if (!video.likes.includes(userId)) {
    video.likes.push(userId);
    await video.save();
  }

  if (!user.likes.includes(videoId)) {
    user.likes.push(videoId);
    await user.save();
  }

  res.status(200).json(new ApiResponse(200, null, "Video liked successfully."));
});

// Unlike a video
export const removeLikeVideo = asyncHandler(async (req, res) => {
  const { videoId, userId } = req.body;

  const [video, user] = await Promise.all([
    Video.findById(videoId),
    newUser.findById(userId),
  ]);

  if (!video || !user) throw new ApiError(404, "User or video not found.");

  video.likes = video.likes.filter(id => id.toString() !== userId);
  user.likes = user.likes.filter(id => id.toString() !== videoId);

  await Promise.all([video.save(), user.save()]);

  res.status(200).json(new ApiResponse(200, null, "Video unliked successfully."));
});

// Update video details
export const updateVideo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, tags } = req.body;

  const video = await Video.findById(id);
  if (!video) throw new ApiError(404, "Video not found.");

  if (title) video.title = title;
  if (description) video.description = description;

  if (req?.files?.thumbnail?.[0]) {
    const uploadedThumb = await uploadOnCloudinary(req.files.thumbnail[0].path);
    video.thumbnail = uploadedThumb.url;
  }

  if (req?.files?.videoFile?.[0]) {
    const uploadedVid = await uploadOnCloudinary(req.files.videoFile[0].path);
    video.videoFile = uploadedVid.url;
  }

  if (tags) {
    video.tags = tags.split(",").map(tag => tag.trim().toLowerCase());
  }

  await video.save();
  res.status(200).json(new ApiResponse(200, video, "Video details updated successfully."));
});
