const { Food } = require("../../../models");

module.exports = async (req, res) => {
  const { foodId } = req.params; // Mengambil foodId makanan dari parameter URL

  try {
    // Cari makanan berdasarkan GUID
    const food = await Food.findOne({ where: { guid: foodId } });

    if (!food) {
      return res.status(404).json({
        code: 404,
        status: "error",
        data: {
          error: "Food not found",
        },
      });
    }

    // Hapus makanan berdasarkan GUID
    await Food.destroy({ where: { guid: foodId } });

    return res.json({
      code: 200,
      status: "success",
      data: {
        message: "Food deleted successfully",
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
