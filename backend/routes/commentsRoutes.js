// backend/routes/commentsRoutes.js
import express from 'express';
import { getCommentsByVideoId, addComment, deleteComment, updateComment,} from '../controllers/commentsController.js';
import { verifyJWT } from "../middlewares/authMiddleware.js"

const router = express.Router();


router.route("/video/:videoId").get(getCommentsByVideoId);
router.route("/video/:videoId").post(verifyJWT, addComment);
router.route("/:commentId").delete(verifyJWT, deleteComment);
router.route("/:commentId").put(verifyJWT, updateComment);

export default router;
