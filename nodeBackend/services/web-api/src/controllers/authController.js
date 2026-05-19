import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../services/db.js";
import { config } from "../config/index.js";
import { uploadToS3 } from "../services/s3.js";
import { generateUniqueId } from "../services/idgen.js";


export const signup = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json("failed");

    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser)
      return res.status(400).json({ error: "Username already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const v_id = generateUniqueId(req.file.originalname);
    const ext = req.file.originalname.split(".").pop();
    const i_name = `${v_id}.${ext}`;

    const uploaded = await uploadToS3(
      req.file.buffer,
      config.S3_X_BUCKET,
      i_name,
      true,
      86400
    );

    if (!uploaded) return res.status(500).json("failed");

    const profilePic = `${config.LOCALSTACK_URL}/${config.S3_X_BUCKET}/${i_name}`;

    await User.create({
      username,
      email,
      password: hashedPassword,
      profilePic,
      likedVideos: [],
      watchHistory: [],
      subscriptions: [],
    });

    return res.status(201).json({ message: "success" });
  } catch (err) {
    console.error(err);
    return res.status(500).json("failed");
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Username and password are required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ error: "Invalid username or password" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(401).json({ error: "Invalid username or password" });

    const token = jwt.sign(
      {
        user_id: user._id.toString(),
        username: user.username,
        vid: user.profilePic,
      },
      config.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.json({
      message: "success",
      token,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json("failed");
  }
};
