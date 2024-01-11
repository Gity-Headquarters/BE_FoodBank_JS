require("dotenv").config();
const { Transaction, User, Booth } = require("../../../models");
const Validator = require("fastest-validator");
const v = new Validator();

const transactionSchema = {
  user_id: { type: "string", empty: false },
  booth_id: { type: "string", empty: false },
};

module.exports = async (req, res) => {
  const { body } = req;

  // validation input data
  const validationResponse = v.validate(body, transactionSchema);

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
    body.total_food = 0;
    const status = "waiting";
    const transaction = await Transaction.create({ ...body, status });
    const booth = await Booth.findOne({ where: { guid: body.booth_id } });
    const user = await User.findOne({ where: { guid: body.user_id } });
    return res.json({
      code: 200,
      status: "success",
      data: {
        transaction: transaction,
        booth: booth,
        user: user,
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
