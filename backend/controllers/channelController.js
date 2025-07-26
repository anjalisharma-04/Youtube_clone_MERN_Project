// backend/controllers/channelController.js

import { Channel } from "../models/channelModel.js";
import { newUser } from "../models/userModel.js";
import { Video } from "../models/videoModel.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

// Create a channel for a user
export const createChannel = asyncHandler(async (req, res) => {
  const { name, handle } = req.body;
  const userId = req.user._id;

  const user = await newUser.findById(userId);
  if (!user) throw new ApiError(404, "User not found");
  if (user.hasChannel) throw new ApiError(400, "User already owns a channel");

  const avatar =
    "https://res.cloudinary.com/dpdwl1tsu/image/upload/v1733578739/egt2sufg3qzyn1ofws9t_xvfn00.jpg";
  const banner =
    "https://res.cloudinary.com/dpdwl1tsu/image/upload/v1733578478/dlekdyn1dep7gevz9zyn.avif";

  const newChannel = await Channel.create({
    name,
    handle,
    owner: userId,
    avatar,
    banner,
  });

  user.hasChannel = true;
  user.channelId = newChannel._id;
  await user.save();

  res
    .status(201)
    .json(new ApiResponse(201, newChannel, "Channel created successfully"));
});

// Retrieve channel by ID
export const getChannel = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const channel = await Channel.findById(id).populate("owner", "-password");
  if (!channel) throw new ApiError(404, "Channel not found");

  res.status(200).json(new ApiResponse(200, channel, "Channel details found"));
});

// Update channel
export const updateChannel = asyncHandler(async (req, res) => {
  const { name, handle, description } = req.body;
  const updates = {};

  if (req.files?.banner?.[0]?.path) {
    const bannerUpload = await uploadOnCloudinary(req.files.banner[0].path);
    updates.banner = bannerUpload?.url;
  }

  if (req.files?.avatar?.[0]?.path) {
    const avatarUpload = await uploadOnCloudinary(req.files.avatar[0].path);
    updates.avatar = avatarUpload?.url;
  }

  if (name) updates.name = name;
  if (handle) updates.handle = handle;
  if (description) updates.description = description;

  const channel = await Channel.findByIdAndUpdate(
    req.params.id,
    { $set: updates },
    { new: true }
  );

  if (!channel) throw new ApiError(404, "Channel not found");

  res.status(200).json(new ApiResponse(200, channel, "Channel updated"));
});

// Subscribe to a channel
export const subscribeToChannel = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const channelId = req.params.id;

  const channel = await Channel.findById(channelId);
  if (!channel) throw new ApiError(404, "Channel not found");

  if (channel.subscribers.includes(userId)) {
    throw new ApiError(400, "Already subscribed");
  }

  channel.subscribers.push(userId);
  await channel.save();

  const user = await newUser.findById(userId);
  user.subscriptions.push(channelId);
  await user.save();

  res.status(200).json(new ApiResponse(200, channel, "Subscribed successfully"));
});

// Unsubscribe from a channel
export const unsubscribeFromChannel = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const channelId = req.params.id;

  const channel = await Channel.findById(channelId);
  if (!channel) throw new ApiError(404, "Channel not found");

  if (!channel.subscribers.includes(userId)) {
    throw new ApiError(400, "Not subscribed to this channel");
  }

  channel.subscribers = channel.subscribers.filter(
    (id) => id.toString() !== userId.toString()
  );
  await channel.save();

  const user = await newUser.findById(userId);
  user.subscriptions = user.subscriptions.filter(
    (id) => id.toString() !== channelId.toString()
  );
  await user.save();

  res.status(200).json(new ApiResponse(200, channel, "Unsubscribed"));
});

// Delete a channel (along with videos and related data)
export const deleteChannel = asyncHandler(async (req, res) => {
  const channelId = req.params.id;
  const userId = req.user._id;

  const channel = await Channel.findById(channelId).populate("videos");
  if (!channel) throw new ApiError(404, "Channel not found");

  if (channel.owner.toString() !== userId.toString()) {
    throw new ApiError(403, "Unauthorized action");
  }

  const videoIds = channel.videos.map((v) => v._id);
  await Video.deleteMany({ _id: { $in: videoIds } });

  await newUser.updateMany(
    { subscriptions: channelId },
    { $pull: { subscriptions: channelId } }
  );

  await newUser.updateMany(
    { likes: { $in: videoIds } },
    { $pull: { likes: { $in: videoIds } } }
  );

  await channel.deleteOne();

  const user = await newUser.findById(userId);
  if (user) {
    user.hasChannel = false;
    user.channelId = null;
    await user.save();
  }

  res.status(200).json(new ApiResponse(200, {}, "Channel deleted"));
});
