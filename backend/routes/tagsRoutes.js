// backend/routes/tagsRoutes.js
import express from "express";
import { createTag, getAllTags, deleteTag, } from "../controllers/tagsController.js";

const router = express.Router();


router.route("/createTags").post(createTag);
router.route("/:commentId").get(getAllTags);
router.route("/deleteTags/:id").delete(deleteTag);

export default router;
