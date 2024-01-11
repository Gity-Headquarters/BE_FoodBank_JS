require("dotenv").config();
const { User } = require("../../../models");
const bcrypt = require("bcrypt");
const Validator = require("fastest-validator");
const v = new Validator();

const donationSchema = {
  amount: { type: "number", empty: false },
  booth_id: { type: "string", empty: false },
};

const createUser = async (req, res) => {
  const { body } = req;

  // validation input data
  const validationResponse = v.validate(body, donationSchema);

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
