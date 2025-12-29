import UserBlipPoint from "../models/userBlipPoints.model.js"

export const getMyBlipPoints = async (req, res) => {
  try {
    const userId = req.user._id;

    let blipPoint = await UserBlipPoint.findOne({ userId });

    // If points doc does not exist, create default one
    if (!blipPoint) {
      blipPoint = await UserBlipPoint.create({
        userId,
        points: 0,
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        points: blipPoint.points,
        isActive: blipPoint.isActive,
        updatedAt: blipPoint.updatedAt,
      },
    });
  } catch (error) {
    console.error("Get Blip Points Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch blip points",
    });
  }
};
