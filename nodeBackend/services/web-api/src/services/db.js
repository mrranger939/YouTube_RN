import mongoose from "mongoose";
import { config } from "../config/index.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGO_URL);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

/* ---------------- SCHEMAS ---------------- */

// USERS (PROFILES)
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  profilePic: String,
  likedVideos: [String],
  watchHistory: [String],
  subscriptions: [String],
});

// CHANNELS
const channelSchema = new mongoose.Schema({
  channel_id: String,
  channelName: String,
  logo: String,
  subscribers: Number,
  chn_banner: String,
  description: String,
  videos: [String],
  shorts: [String],
  created_date: Date,
});

// VIDEOS
const videoSchema = new mongoose.Schema({
  video_id: String,
  channel_id: String,
  videoTitle: String,
  genre: String,
  videoDescription: String,
  likes: Number,
  dislikes: Number,
  views: Number,
  comments: Array,
  timestamp: Date,
});

/* ---------------- MODELS ---------------- */
export const User = mongoose.model("User", userSchema);
export const Channel = mongoose.model("Channel", channelSchema);
export const Video = mongoose.model("Video", videoSchema);
