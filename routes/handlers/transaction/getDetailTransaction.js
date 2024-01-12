const { Transaction, User, Booth } = require("../../../models");

module.exports = async (req, res) => {
  try {
    const { transactionGuid } = req.params;

    // Find the transaction by GUID
    const transaction = await Transaction.findOne({
      where: { guid: transactionGuid },
    });

    // If the transaction is not found, return a 404 response
    if (!transaction) {
      return res.status(404).json({
        code: 404,
        status: "error",
        data: {
          error: "Transaction not found",
        },
      });
    }

    // Get booth and user details for the transaction
    const booth = await Booth.findOne({
      where: { guid: transaction.booth_id },
      //   attributes: ["id", "guid", "name", "address"],
    });

    const user = await User.findOne({
      where: { guid: transaction.user_id },
      //   attributes: ["id", "guid", "username", "email"],
    });

    // Combine information about the transaction, booth, and user
    const result = {
      ...transaction.toJSON(),
      Booth: booth || null,
      User: user || null,
    };

    return res.json({
      code: 200,
      status: "success",
      data: {
        transaction: result,
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
