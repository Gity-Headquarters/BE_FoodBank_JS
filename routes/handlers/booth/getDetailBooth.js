const { Booth } = require("../../../models");

module.exports = async (req, res) => {
  try {
    const { params } = req;
    const boothId = params.boothId;

    // Find the booth by its GUID
    const booth = await Booth.findOne({
      where: { guid: boothId },
    });

    if (!booth) {
      return res.status(404).json({
        code: 404,
        status: "error",
        data: {
          error: "Booth not found",
        },
      });
    }

    return res.json({
      code: 200,
      status: "success",
      data: booth,
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      status: "error",
      data: error.message,
    });
  }
};
