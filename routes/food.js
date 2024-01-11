const express = require("express");
const router = express.Router();
const { multerUpload } = require("../middleware/gcsStorage");

const foodHandler = require("./handlers/food");

router.post("/", multerUpload.single("image"), foodHandler.createFood);
router.put("/foodId", multerUpload.single("image"), foodHandler.updateFood);
router.delete("/foodId", foodHandler.deleteFood);
router.get("/", foodHandler.listFood);

module.exports = router;
