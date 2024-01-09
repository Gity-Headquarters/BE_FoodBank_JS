const { Booth } = require("../../../models");
const Validator = require("fastest-validator");
const v = new Validator();
const { bucket } = require("../../../middleware/gcsStorage");

const boothSchema = {
  name: { type: "string", optional: true, max: 255 },
  address: { type: "string", optional: true },
  image: { type: "string", optional: true, max: 255 },
  food_total: { type: "number", optional: true },
  time_open: { type: "string", optional: true },
  time_close: { type: "string", optional: true },
  status: {
    type: "enum",
    values: ["open", "empty food", "close"],
    optional: true,
  },
  info_booth: { type: "string", optional: true },
  description: { type: "string", optional: true },
  number_phone: { type: "string", optional: true },
};

module.exports = async (req, res) => {
  const { body, file, params } = req;

  const validationResponse = v.validate(body, boothSchema);

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
    if (file) {
      const newFileName = `booth_${file.originalname}`;
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
          const imageUrl = `https://storage.googleapis.com/${bucket.name}/${newFileName}`;
          const boothId = params.boothId; // Ambil ID Booth dari parameter

          const updatedRows = await Booth.update(
            { ...body, image: imageUrl }, // Data yang akan diperbarui
            { where: { guid: boothId } } // Kriteria untuk booth yang akan diperbarui
          );

          if (updatedRows[0] === 0) {
            return res.status(404).json({
              code: 404,
              status: "error",
              data: {
                error: "Booth not found",
              },
            });
          }

          const booth = await Booth.findByPk(boothId);

          return res.json({
            code: 200,
            status: "success",
            data: {
              guid: booth.guid,
              name: booth.name,
              image: booth.image,
              description: booth.description,
              address: booth.address,
              food_total: booth.food_total,
              time_open: booth.time_open,
              time_close: booth.time_close,
              status: booth.status,
              info_booth: booth.info_booth,
              number_phone: booth.number_phone,
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
      const boothId = params.boothId;

      const updatedBooth = await Booth.update(
        { ...body }, // Data yang akan diubah
        { where: { guid: boothId } } // Kriteria booth yang akan diubah
      );

      // Pastikan data booth yang diubah telah diperbarui
      if (updatedBooth[0] === 0) {
        return res.status(404).json({
          code: 404,
          status: "error",
          data: {
            error: "Booth not found",
          },
        });
      }

      // Dapatkan booth yang telah diubah dari database
      const booth = await Booth.findByPk(boothId);

      return res.json({
        code: 200,
        status: "success",
        data: {
          guid: booth.guid,
          name: booth.name,
          image: booth.image,
          description: booth.description,
          address: booth.address,
          food_total: booth.food_total,
          time_open: booth.time_open,
          time_close: booth.time_close,
          status: booth.status,
          info_booth: booth.info_booth,
          number_phone: booth.number_phone,
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
