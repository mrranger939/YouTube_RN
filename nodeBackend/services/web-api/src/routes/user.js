import { Router } from "express";
import { userDetails, getUserPublicProfile } from "../controllers/userController.js";

const router = Router();

router.get("/user/:userId", userDetails);
router.get("/user/profile/:userId", getUserPublicProfile );

export default router;
