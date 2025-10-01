// backend/controllers/accountController.js

import { newUser } from "../models/userModel.js";
import { Video } from "../models/videoModel.js";
import { Comment } from "../models/commentModels.js";
import { Channel } from "../models/channelModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Helper: Generate access token
const generateAccessToken = async (userId) => {
  const user = await newUser.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found for token generation");
  }
  const accessToken = user.generateAccessToken();
  await user.save({ validateBeforeSave: false });
  return { accessToken };
};

// @desc Register user
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "Please fill in all required fields.");
  }

  const userExists = await newUser.findOne({
    $or: [{ email }, { name }],
  });

  if (userExists) {
    throw new ApiError(409, "User already exists with this email or username.");
  }

  const defaultAvatar =
    "https://res.cloudinary.com/dpdwl1tsu/image/upload/v1733578739/egt2sufg3qzyn1ofws9t_xvfn00.jpg";

  const user = await newUser.create({
    name,
    email,
    password,
    avatar: defaultAvatar,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, user, "User registered successfully"));
});

// @desc Login user
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required.");
  }

  const user = await newUser.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  const isMatch = await user.isPasswordCorrect(password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials.");
  }

  const { accessToken } = await generateAccessToken(user._id);
  const safeUser = await newUser.findById(user._id).select("-password");

  return res
    .status(200)
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
    })
    .json(new ApiResponse(200, { user: safeUser, accessToken }, "Login successful"));
});

// @desc Logout user
export const logoutUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .clearCookie("accessToken", { httpOnly: true, secure: true })
    .json(new ApiResponse(200, {}, "Logout successful"));
});

// @desc Update account
export const updateAccount = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  let avatarUrl;
  if (req.file) {
    const uploaded = await uploadOnCloudinary(req.file.path);
    avatarUrl = uploaded.url;
  }

  const updates = {
    name,
    email,
    password,
    ...(avatarUrl && { avatar: avatarUrl }),
  };

  const updated = await newUser.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, updated, "Account updated successfully"));
});

// @desc Get user by ID
export const getUserById = asyncHandler(async (req, res) => {
  const user = await newUser.findById(req.params.id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json(new ApiResponse(200, user, "User details fetched"));
});

// @desc Delete account and related data
export const deleteAccount = asyncHandler(async (req, res) => {
  const user = await newUser.findById(req.params.id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.channelId) {
    const channelId = user.channelId;
    const videos = await Video.find({ channelId });
    const videoIds = videos.map((v) => v._id);

    await Video.deleteMany({ channelId });

    if (videoIds.length > 0) {
      await newUser.updateMany(
        { likes: { $in: videoIds } },
        { $pull: { likes: { $in: videoIds } } }
      );
    }

    await newUser.updateMany(
      { subscriptions: channelId },
      { $pull: { subscriptions: channelId } }
    );

    await Channel.findByIdAndDelete(channelId);
  }

  if (user.subscriptions?.length > 0) {
    await Channel.updateMany(
      { _id: { $in: user.subscriptions } },
      { $pull: { subscribers: user._id } }
    );
  }

  await Video.deleteMany({ owner: user._id });
  await Comment.deleteMany({ userId: user._id });

  await Video.updateMany(
    { likes: user._id },
    { $pull: { likes: user._id } }
  );

  await user.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "User account and all data deleted"));
});
