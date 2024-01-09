const { Booth } = require("../../../models");
const Validator = require("fastest-validator");
const v = new Validator();

module.exports = async (req, res) => {
  const { params } = req;

  const validationResponse = v.validate(params, {
    boothId: { type: "string", optional: false },
  });

  if (validationResponse !== true) {
    return res.status(400).json({
      code: 400,
      status: "error",
      data: {
        error: "Validation failed",
        details: validationResponse,
      },
    });
  }

  try {
    const boothId = params.boothId;

    // Cari Booth dengan boothId yang diberikan
    const booth = await Booth.findOne({ where: { guid: boothId } });

    if (!booth) {
      return res.status(404).json({
        code: 404,
        status: "error",
        data: {
          error: "Booth not found",
        },
      });
    }

    // Hapus Booth dengan boothId yang diberikan
    await Booth.destroy({ where: { guid: boothId } });

    return res.json({
      code: 200,
      status: "success",
      data: {
        message: "Booth deleted successfully",
      },
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      status: "error",
      data: error.message,
    });
  }
};
