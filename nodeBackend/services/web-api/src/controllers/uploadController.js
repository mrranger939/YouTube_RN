import { Video, Channel } from "../services/db.js";
import { uploadToS3 } from "../services/s3.js";
import { generateUniqueId } from "../services/idgen.js";
import { sendVideoMessage } from "../services/kafka.js";
import { config } from "../config/index.js";

export const uploadVideo = async (req, res) => {
  try {
    if (!req.files?.resizedImage || !req.files?.video) {
      return res.status(400).json("Image or Video file missing");
    }

    const { description, genre, videoTitle } = req.body;
    const { user_id, username, vid } = req.user;

    const channel = await Channel.findOne({ channel_id: user_id });
    if (!channel) return res.status(400).json("Channel not found");

    const imageFile = req.files.resizedImage[0];
    const videoFile = req.files.video[0];

    const v_id = generateUniqueId(videoFile.originalname);

    const videoExt = videoFile.originalname.split(".").pop();
    const imageExt = imageFile.originalname.split(".").pop();

    const v_name = `${v_id}.${videoExt}`;
    const i_name = `${v_id}.${imageExt}`;

    const videoUploaded = await uploadToS3(
      videoFile.buffer,
      config.S3_U_BUCKET,
      v_name
    );

    const imageUploaded = await uploadToS3(
      imageFile.buffer,
      config.S3_I_BUCKET,
      i_name,
      true
    );

    if (!videoUploaded || !imageUploaded)
      return res.status(500).json("failed");

    await Channel.updateOne(
      { channel_id: user_id },
      { $push: { videos: v_id } }
    );

    await Video.create({
      video_id: v_id,
      channel_id: user_id,
      videoTitle,
      genre,
      videoDescription: description,
      likes: 0,
      dislikes: 0,
      views: 0,
      comments: [],
      timestamp: new Date(),
    });

    await sendVideoMessage(v_name);

    return res.json("success");
  } catch (err) {
    console.error(err);
    return res.status(500).json("failed");
  }
};
