import { User } from "../services/db.js";
export const userDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    if (error?.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid userId",
      });
    }
    console.error("Error fetching user details:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// /user/profile/:userId

export const getUserPublicProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("username profilePic");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    if (error?.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid userId",
      });
    }
    console.error("Error fetching public user profile:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
