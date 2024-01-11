require("dotenv").config();
const { Transaction, User, Food } = require("../../../models");
const Validator = require("fastest-validator");
const v = new Validator();

const transactionSchema = {
  status: { type: "string", empty: false },
  food_id: { type: "string", empty: false }, // Ditambahkan untuk status "approve"
  total: { type: "number", empty: false }, // Ditambahkan untuk status "approve"
};

module.exports = async (req, res) => {
  try {
    const { body, params } = req;
    const transactionId = params.transactionId;

    if (body.status === "taked") {
      // Validation for "approve" status
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

      // Update food quantity
      const food = await Food.findOne({ where: { guid: body.food_id } });
      if (food) {
        const jumlah = food.jumlah - body.total;
        await Food.update({ jumlah }, { where: { guid: body.food_id } });
      } else {
        return res.status(404).json({
          code: 404,
          status: "error",
          data: {
            error: "Food not found",
          },
        });
      }
    }

    // Update transaction
    const updatedTransaction = await Transaction.update(
      {
        status: body.status,
        total_food: body.total || 0, // Ditambahkan untuk status "approve"
      },
      { where: { guid: transactionId } }
    );

    // Fetch updated transaction
    const updatedTransactionData = await Transaction.findOne({
      where: { guid: transactionId },
    });

    return res.json({
      code: 200,
      status: "success",
      data: {
        transaction: updatedTransactionData,
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
