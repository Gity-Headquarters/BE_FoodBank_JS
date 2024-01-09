const { Booth } = require("../../../models");

module.exports = async (req, res) => {
  try {
    const booths = await Booth.findAll();

    return res.json({
      code: 200,
      status: "success",
      data: booths,
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      status: "error",
      data: error.message,
    });
  }
};
