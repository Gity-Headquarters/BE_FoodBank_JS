const express = require("express");
const router = express.Router();

const transactionHandler = require("./handlers/transaction");

router.post("/", transactionHandler.createTransaction);
router.get("/", transactionHandler.listTransaction);
router.put("/:transactionId", transactionHandler.updateTransaction);

module.exports = router;
