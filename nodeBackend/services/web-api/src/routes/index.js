import { Router } from "express";
import { tokenRequired } from "../middleware/auth.js";
import authRoutes from "./auth.js";
import uploadRoutes from "./upload.js";
import videoRoutes from "./videos.js";

const router = Router();

router.use("/", authRoutes);
router.use("/", uploadRoutes);  
router.use("/", videoRoutes);

router.get("/", (req, res) => {
  res.send("Server is running");
});

router.get("/protected", tokenRequired, (req, res) => {
  res.json({ message: "You are authorized", user: req.user });
});

export default router;
