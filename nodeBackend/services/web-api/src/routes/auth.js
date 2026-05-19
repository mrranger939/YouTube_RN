import { Router } from "express";
import multer from "multer";
import { signup, login } from "../controllers/authController.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/signup", upload.single("profilePic"), signup);
router.post("/login", login);

export default router;
