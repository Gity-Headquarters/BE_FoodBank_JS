const { Food } = require("../../../models");

module.exports = async (req, res) => {
  try {
    // Mengambil semua data makanan dari database
    const foods = await Food.findAll();

    if (!foods || foods.length === 0) {
      return res.status(404).json({
        code: 404,
        status: "error",
        data: {
          error: "No foods found",
        },
      });
    }

    // Mengirimkan daftar makanan sebagai respons
    return res.json({
      code: 200,
      status: "success",
      data: foods,
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      status: "error",
      data: error.message,
    });
  }
};
