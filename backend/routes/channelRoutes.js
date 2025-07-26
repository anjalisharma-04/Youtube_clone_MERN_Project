// backend/routes/channelRoutes.js
import { Router } from "express";
import {
  createChannel,
  getChannel,
  updateChannel,
  deleteChannel,
  subscribeToChannel,
  unsubscribeFromChannel,
} from "../controllers/channelController.js";

import { upload } from "../middlewares/multerMiddleware.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";

const router = Router();

// Get channel info (public)
router.get("/data/:id", getChannel);

// Protected routes
router.use(verifyJWT);

router.post("/create", createChannel);
router.put(
  "/update/:id",
  upload.fields([
    { name: "banner", maxCount: 1 },
    { name: "avatar", maxCount: 1 },
  ]),
  updateChannel
);
router.delete("/delete/:id", deleteChannel);
router.post("/subscribe/:id", subscribeToChannel);
router.post("/unsubscribe/:id", unsubscribeFromChannel);

export default router;
