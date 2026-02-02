import { Channel, Video, User } from "../services/db.js";
import { uploadToS3 } from "../services/s3.js";
import { generateUniqueId } from "../services/idgen.js";
import { config } from "../config/index.js";

/* POST /createChannel */
export const createChannel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json("failed");
    }

    const { channelName, description, usedId } = req.body;

    // check if user already has a channel
    const existingUserChannel = await Channel.findOne({
      channel_id: usedId,
    });
    if (existingUserChannel) {
      return res
        .status(400)
        .json({ error: "You Already have a channel you cannot create one" });
    }

    // check if channel name exists
    const existingChan = await Channel.findOne({ channelName });
    if (existingChan) {
      return res.status(400).json({ error: "Channelname already exists" });
    }

    // generate id for banner
    const v_id = generateUniqueId(req.file.originalname);
    const ext = req.file.originalname.split(".").pop();
    const i_name = `${v_id}.${ext}`;

    // upload banner to S3
    const uploaded = await uploadToS3(
      req.file.buffer,
      config.S3_X_BUCKET,
      i_name,
      true,
      86400
    );

    if (!uploaded) return res.status(500).json("failed");

    const channelBanner = `${config.LOCALSTACK_URL}/${config.S3_X_BUCKET}/${i_name}`;

    // get user's profile pic for logo
    const user = await User.findById(usedId, { profilePic: 1 });

    await Channel.create({
      channel_id: usedId,
      channelName,
      logo: user.profilePic,
      subscribers: 0,
      chn_banner: channelBanner,
      description,
      videos: [],
      shorts: [],
      created_date: new Date(),
    });

    return res.status(201).json({ message: "success" });
  } catch (err) {
    console.error(err);
    return res.status(500).json("failed");
  }
};

/* GET /channel/:channelId */
export const channelData = async (req, res) => {
  try {
    const { channelId } = req.params;

    const channelData = await Channel.findOne(
      { channel_id: channelId },
      { _id: 0 }
    );

    if (!channelData) {
      return res.status(404).json({ error: "Channel not found" });
    }

    const videosList = channelData.videos || [];

    const videoData = await Video.find(
      { video_id: { $in: videosList } },
      { _id: 0, dislikes: 0, comments: 0 }
    );

    return res.json({ channelData, video_data: videoData });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

/* GET /chn/card/:chn_id */
export const chnCard = async (req, res) => {
  try {
    const { chn_id } = req.params;

    const chn_det = await Channel.findOne(
      { channel_id: chn_id },
      { _id: 0, channelName: 1, logo: 1 }
    );

    if (!chn_det) {
      return res.status(404).json({ error: "Channel not found" });
    }

    return res.json(chn_det);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/* GET /chn/vid/:chn_id */
export const chnVid = async (req, res) => {
  try {
    const { chn_id } = req.params;

    const chn_det = await Channel.findOne(
      { channel_id: chn_id },
      { _id: 0, channelName: 1, logo: 1, subscribers: 1 }
    );

    if (!chn_det) {
      return res.status(404).json({ error: "Channel not found" });
    }

    return res.json(chn_det);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/* GET /checkifchannel/:channelId */
export const checkIfChannel = async (req, res) => {
  try {
    const { channelId } = req.params;

    const existing = await Channel.findOne({ channel_id: channelId });

    if (!existing) {
      return res.json("fail");
    }

    return res.json("success");
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/* GET /list/channels */
export const listChannels = async (req, res) => {
  try {
    const channels = await Channel.find({}, { _id: 0 });
    return res.json({ data: channels });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
