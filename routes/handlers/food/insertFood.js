const { Food, Booth } = require("../../../models");
const Validator = require("fastest-validator");
const v = new Validator();
const { bucket } = require("../../../middleware/gcsStorage");

const foodSchema = {
  name: { type: "string", empty: false },
  jenis: {
    type: "string",
    empty: false,
    enum: [
      "sembako",
      "minuman",
      "makanan berat",
      "makanan ringan",
      "buah buahan",
      "kue dan roti",
    ],
  },
  jumlah: { type: "string", positive: true },
  id_booth: { type: "string", empty: false },
};

module.exports = async (req, res) => {
  const { body, file } = req;

  const validationResponse = v.validate(body, foodSchema);

  console.log(body);
  console.log(file);

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
    if (!file) {
      return res.status(400).json({
        code: 400,
        status: "error",
        data: {
          error: "No file uploaded",
        },
      });
    }

    const newFileName = `food_${file.originalname}`;
    const blob = bucket.file(newFileName);
    const blobStream = blob.createWriteStream();

    console.log(blob);

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
        const imageUrl = `https://storage.googleapis.com/${bucket.name}/${newFileName}`;

        // Start a transaction to ensure consistency
        const transaction = await Food.sequelize.transaction();

        try {
          // Find the booth
          const booth = await Booth.findOne({
            where: { guid: body.id_booth },
            attributes: ["id", "food_total"],
            transaction,
          });

          if (!booth) {
            throw new Error("Booth not found");
          }

          // Update food_total of the booth
          const updatedFoodTotal = booth.food_total + parseInt(body.jumlah, 10);

          // Update the booth
          await Booth.update(
            { food_total: updatedFoodTotal },
            { where: { guid: body.id_booth }, transaction }
          );

          // Create the food record
          const food = await Food.create(
            {
              ...body,
              image: imageUrl,
            },
            { transaction }
          );

          // Commit the transaction
          await transaction.commit();

          return res.json({
            code: 200,
            status: "success",
            data: {
              guid: food.guid,
              name: food.name,
              type: food.jenis,
              food_total: food.jumlah,
              image: food.image,
              id_booth: food.id_booth,
            },
          });
        } catch (error) {
          // Rollback the transaction in case of an error
          await transaction.rollback();
          throw error;
        }
      } catch (error) {
        return res.status(500).json({
          code: 500,
          status: "error",
          data: error.message,
        });
      }
    });

    blobStream.end(file.buffer);
  } catch (error) {
    return res.status(500).json({
      code: 500,
      status: "error",
      data: error.message,
    });
  }
};
