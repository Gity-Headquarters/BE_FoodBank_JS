const express = require("express");
const router = express.Router();
const { multerUpload } = require("../middleware/gcsStorage");

const foodHandler = require("./handlers/food");

router.post("/", multerUpload.single("image"), foodHandler.createFood);

module.exports = router;
