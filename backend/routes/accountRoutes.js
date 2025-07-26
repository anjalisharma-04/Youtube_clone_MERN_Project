//backend/routes/accountRoutes.js
import { Router } from "express";
import { deleteAccount, registerUser, login, updateAccount, logoutUser, getUserById} from "../controllers/accountController.js";
import { upload } from "../middlewares/multerMiddleware.js"
import { verifyJWT } from "../middlewares/authMiddleware.js";

const router = Router()

router.route("/signup").post(registerUser)
router.route("/login").post(login)
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/delete/:id").delete(deleteAccount)
router.route("/update/:id").put(upload.single("avatar"), updateAccount);
router.route("/userData/:id").get(getUserById)


export default router