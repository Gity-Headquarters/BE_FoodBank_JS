const express = require("express");
const router = express.Router();
const { multerUpload } = require("../middleware/gcs-storage");

const boothHandler = require("./handlers/booth");

router.post("/", multerUpload.single("image"), boothHandler.createBooth);
router.put("/:boothId", multerUpload.single("image"), boothHandler.updateBooth);

module.exports = router;
