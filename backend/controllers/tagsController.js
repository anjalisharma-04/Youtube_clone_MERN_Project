// backend/controllers/tagsController.js

import { Tag } from "../models/tagsModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

// ➕ Create a new tag
export const createTag = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name?.trim()) {
    throw new ApiError(400, "Tag name must be provided");
  }

  const tagExists = await Tag.findOne({ name });

  if (tagExists) {
    throw new ApiError(400, "This tag already exists");
  }

  const newTag = await Tag.create({ name });

  res.status(201).json(
    new ApiResponse(201, newTag, "New tag created successfully")
  );
});

// 📃 Get all available tags
export const getAllTags = asyncHandler(async (req, res) => {
  const tags = await Tag.find();

  res.status(200).json(
    new ApiResponse(200, tags, "All tags retrieved")
  );
});

// 🗑️ Remove a tag by ID
export const deleteTag = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const tag = await Tag.findById(id);

  if (!tag) {
    throw new ApiError(404, "No tag found with the given ID");
  }

  await tag.deleteOne();

  res.status(200).json(
    new ApiResponse(200, {}, "Tag removed successfully")
  );
});
