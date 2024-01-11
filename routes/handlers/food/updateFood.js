const { Food } = require("../../../models");
const Validator = require("fastest-validator");
const v = new Validator();
const { bucket } = require("../../../middleware/gcsStorage");

const foodSchema = {
  name: { type: "string", optional: true, max: 255 },
  jenis: {
    type: "string",
    optional: true,
    enum: [
      "sembako",
      "minuman",
      "makanan berat",
      "makanan ringan",
      "buah buahan",
      "kue dan roti",
    ],
  },
  jumlah: { type: "string", optional: true },
  id_booth: { type: "string", optional: true }, // Pastikan ID Booth diberikan
};

module.exports = async (req, res) => {
  const { body, file, params } = req;

  const validationResponse = v.validate(body, foodSchema);

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
    const foodId = params.foodId; // Ambil GUID Food dari parameter

    // Cari Food dengan GUID yang diberikan
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

    let updatedImageUrl = food.image;

    if (file) {
      const newFileName = `food_${file.originalname}`;
      const blob = bucket.file(newFileName);
      const blobStream = blob.createWriteStream();

      blobStream.on("error", (err) => {
        console.error(err);
        return res.status(500).json({
          code: 500,
          status: "error",
          data: err.message,
        });
      });

      blobStream.on("finish", async () => {
        try {
          updatedImageUrl = `https://storage.googleapis.com/${bucket.name}/${newFileName}`;

          // Update data makanan
          await food.update({
            ...body,
            image: updatedImageUrl,
          });

          return res.json({
            code: 200,
            status: "success",
            data: {
              guid: food.guid,
              name: food.name,
              type: food.jenis,
              food_total: food.jumlah,
              image: updatedImageUrl,
              id_booth: food.id_booth,
            },
          });
        } catch (error) {
          return res.status(500).json({
            code: 500,
            status: "error",
            data: error.message,
          });
        }
      });

      blobStream.end(file.buffer);
    } else {
      // Jika tidak ada file yang diunggah, hanya update data makanan
      await food.update(body);

      return res.json({
        code: 200,
        status: "success",
        data: {
          guid: food.guid,
          name: food.name,
          type: food.jenis,
          food_total: food.jumlah,
          image: updatedImageUrl,
          id_booth: food.id_booth,
        },
      });
    }
  } catch (error) {
    return res.status(500).json({
      code: 500,
      status: "error",
      data: error.message,
    });
  }
};
