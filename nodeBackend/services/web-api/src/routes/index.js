import { Router } from "express";
import { tokenRequired } from "../middleware/auth.js";
import authRoutes from "./auth.js";

const router = Router();

router.use("/", authRoutes);

router.get("/", (req, res) => {
  res.send("Server is running");
});

router.get("/protected", tokenRequired, (req, res) => {
  res.json({ message: "You are authorized", user: req.user });
});

export default router;
