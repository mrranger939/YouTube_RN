import jwt from "jsonwebtoken";
import { config } from "../config/index.js";


export const tokenRequired = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token is missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = {
      user_id: decoded.user_id,
      username: decoded.username,
      vid: decoded.vid,
    };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};


export const optionalToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    req.user = { user_id: null, username: "Guest" };
    return next();
  }

  try {
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = {
      user_id: decoded.user_id,
      username: decoded.username,
      vid: decoded.vid,
    };
  } catch (err) {
    req.user = {
      user_id: null,
      username: "Guest",
      vid: "https://img.freepik.com/free-psd/contact-icon-illustration-isolated_23-2151903337.jpg",
    };
  }

  next();
};
