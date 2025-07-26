// backend/routes/videoRoutes.js
import { Router } from "express";
import {
  publishAVideo,
  getAllVideos,
  getAllUserVideos,
  deleteVideoById,
  VideoDataById,
  viewsIncrement,
  likeVideo,
  removeLikeVideo,
  updateVideo,
} from "../controllers/videoController.js";

import { upload } from "../middlewares/multerMiddleware.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";

const router = Router();

// Multer config for videos
const videoUpload = upload.fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "videoFile", maxCount: 1 },
]);

// Public routes
router.get("/allVideo", getAllVideos);
router.get("/videoData/:id", VideoDataById);
router.get("/allUserVideo/:owner", getAllUserVideos);

// Protected routes (need token)
router.use(verifyJWT);

router.post("/publish", videoUpload, publishAVideo);
router.delete("/delete/:id", deleteVideoById);
router.put("/incrementView/:id", viewsIncrement);
router.post("/like", likeVideo);
router.post("/removelike", removeLikeVideo);

// 🔥 Fixed: video update should use video-related upload fields
router.put("/update/:id", videoUpload, updateVideo);

export default router;
