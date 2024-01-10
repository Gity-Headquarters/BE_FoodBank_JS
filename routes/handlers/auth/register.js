require("dotenv").config();
const { User } = require("../../../models");
const bcrypt = require("bcrypt");
const Validator = require("fastest-validator");
const v = new Validator();

const userSchema = {
  nik: { type: "string", empty: false, max: 17 },
  username: { type: "string", empty: false, max: 255 },
  image_profile: { type: "string", optional: true, max: 255 },
  address: { type: "string", optional: true, max: 255 },
  email: { type: "email", empty: false },
  password: { type: "string", min: 8, empty: false },
};

const createUser = async (req, res) => {
  const { body } = req;

  // validation input data
  const validationResponse = v.validate(body, userSchema);

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

  let defaultImages = [
    "https://storage.googleapis.com/foodbank-assets/profile_default_1.svg",
    "https://storage.googleapis.com/foodbank-assets/profile_default_2.svg",
    "https://storage.googleapis.com/foodbank-assets/profile_default_3.svg",
    "https://storage.googleapis.com/foodbank-assets/profile_default_4.svg",
  ];

  // Mengisi image_profile secara acak dari default image jika kosong
  if (!body.image_profile) {
    body.image_profile =
      defaultImages[Math.floor(Math.random() * defaultImages.length)];
  }

  const isEmailUsed = await User.findOne({
    where: { email: body.email },
  });

  if (isEmailUsed) {
    return res.status(400).json({
      code: 400,
      status: "error",
      data: {
        error: "Email has been used",
      },
    });
  }

  const isNikUsed = await User.findOne({
    where: { nik: body.nik },
  });

  if (isNikUsed) {
    return res.status(400).json({
      code: 400,
      status: "error",
      data: {
        error: "NIK has been used",
      },
    });
  }

  const password = bcrypt.hashSync(body.password, 10);

  try {
    const user = await User.create({ ...body, password });
    return res.json({
      code: 200,
      status: "success",
      data: {
        username: user.username,
        email: user.email,
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

module.exports = createUser;
