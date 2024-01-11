const { Transaction, User, Booth } = require("../../../models");

module.exports = async (req, res) => {
  try {
    const transactions = await Transaction.findAll();

    // Ambil id Booth dan User dari setiap transaksi
    const boothIds = transactions.map((transaction) => transaction.booth_id);
    const userIds = transactions.map((transaction) => transaction.user_id);

    // Ambil data Booth dan User berdasarkan id yang telah diambil
    const booths = await Booth.findAll({
      where: { guid: boothIds },
      attributes: ["id", "guid", "name", "address"],
    });

    const users = await User.findAll({
      where: { guid: userIds },
      attributes: ["id", "guid", "username", "email"],
    });

    // Gabungkan informasi Booth dan User ke setiap transaksi
    const result = transactions.map((transaction) => {
      const booth = booths.find((booth) => booth.guid === transaction.booth_id);
      const user = users.find((user) => user.guid === transaction.user_id);

      return {
        ...transaction.toJSON(),
        Booth: booth || null,
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
