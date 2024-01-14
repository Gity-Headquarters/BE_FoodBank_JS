const express = require("express");
const router = express.Router();
const { multerUpload } = require("../middleware/gcsStorage");

const boothHandler = require("./handlers/booth");

router.post("/", multerUpload.single("image"), boothHandler.createBooth);
router.put("/:boothId", multerUpload.single("image"), boothHandler.updateBooth);
router.get("/", boothHandler.listBooth);
router.get("/:boothId", boothHandler.getDetailBooth);
router.delete("/:boothId", boothHandler.deleteBooth);

module.exports = router;
