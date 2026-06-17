import { Router } from "express";
import { userDetails } from "../controllers/userController.js";

const router = Router();

router.get("/user/:userId", userDetails);

export default router;
