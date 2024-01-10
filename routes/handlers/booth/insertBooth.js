const { Booth } = require("../../../models");
const Validator = require("fastest-validator");
const v = new Validator();
const { bucket } = require("../../../middleware/gcsStorage");

const boothSchema = {
  name: { type: "string", empty: false, max: 255 },
  address: { type: "string", empty: false },
  image: { type: "string", optional: true, max: 255 },
  food_total: { type: "string", empty: false },
  time_open: { type: "string", empty: false },
  time_close: { type: "string", empty: false },
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
  const { body, file } = req;

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
    if (!file) {
      return res.status(400).json({
        code: 400,
        status: "error",
        data: {
          error: "No file uploaded",
        },
      });
    }

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

    if (body.status === "") {
      body.status = "close";
    }

    blobStream.on("finish", async () => {
      try {
        const imageUrl = `https://storage.googleapis.com/${bucket.name}/${newFileName}`;
        const booth = await Booth.create({
          ...body,
          image: imageUrl,
        });

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
  } catch (error) {
    return res.status(500).json({
      code: 500,
      status: "error",
      data: error.message,
    });
  }
};
