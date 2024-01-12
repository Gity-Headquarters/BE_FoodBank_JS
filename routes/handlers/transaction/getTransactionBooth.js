const { Transaction, User, Booth } = require("../../../models");

module.exports = async (req, res) => {
  try {
    const { boothGuid } = req.params;

    // Find booth by GUID to ensure it exists
    const booth = await Booth.findOne({
      where: { guid: boothGuid },
      attributes: ["id", "guid", "name", "address"],
    });

    if (!booth) {
      return res.status(404).json({
        code: 404,
        status: "error",
        data: {
          error: "Booth not found",
        },
      });
    }

    // Find transactions associated with the booth
    const transactions = await Transaction.findAll({
      where: { booth_id: boothGuid },
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

    // Get user IDs from transactions
    const userIds = transactions.map((transaction) => transaction.user_id);

    // Find users associated with the transactions
    const users = await User.findAll({
      where: { guid: userIds },
      attributes: ["id", "guid", "username", "email"],
    });

    // Combine information about users and booths into each transaction
    const result = transactions.map((transaction) => {
      const user = users.find((user) => user.guid === transaction.user_id);

      return {
        ...transaction.toJSON(),
        Booth: booth,
        User: user || null,
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
