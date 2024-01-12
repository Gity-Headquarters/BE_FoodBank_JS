const express = require("express");
const router = express.Router();

const transactionHandler = require("./handlers/transaction");

router.post("/", transactionHandler.createTransaction);
router.get("/", transactionHandler.listTransaction);
router.put("/:transactionId", transactionHandler.updateTransaction);
router.get("/user/:userGuid", transactionHandler.getTransactionUser);
router.get("/booth/:boothGuid", transactionHandler.getTransactionBooth);
router.get("/:transactionGuid", transactionHandler.getDetailTransaction);

module.exports = router;
