const { Transaction, User, Booth } = require("../../../models");

module.exports = async (req, res) => {
  try {
    const { userGuid } = req.params;

    // Find user by GUID to ensure it exists
    const user = await User.findOne({
      where: { guid: userGuid },
      attributes: ["id", "guid", "username", "email"],
    });

    if (!user) {
      return res.status(404).json({
        code: 404,
        status: "error",
        data: {
          error: "User not found",
        },
      });
    }

    // Find transactions associated with the user
    const transactions = await Transaction.findAll({
      where: { user_id: userGuid },
    });

    // If there are no transactions, return an empty array
    if (!transactions || transactions.length === 0) {
      return res.json({
        code: 200,
        status: "success",
        data: {
          transactions: [],
        },
      });
    }

    // Get booth IDs from transactions
    const boothIds = transactions.map((transaction) => transaction.booth_id);

    // Find booths associated with the transactions
    const booths = await Booth.findAll({
      where: { guid: boothIds },
      attributes: ["id", "guid", "name", "address"],
    });

    // Combine information about booths and users into each transaction
    const result = transactions.map((transaction) => {
      const booth = booths.find((booth) => booth.guid === transaction.booth_id);

      return {
        ...transaction.toJSON(),
        Booth: booth || null,
        User: user,
      };
    });

    return res.json({
      code: 200,
      status: "success",
      data: {
        transactions: result,
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
