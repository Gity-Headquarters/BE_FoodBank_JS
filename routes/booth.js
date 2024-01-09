const express = require("express");
const router = express.Router();
const { multerUpload } = require("../middleware/gcs-storage"); // Sesuaikan dengan path ke file konfigurasi GCS

const boothHandler = require("./handlers/booth");

router.post("/", multerUpload.single("image"), boothHandler.createBooth);
// router.get("/", plantHandler.getAllPlant);
// router.put("/:id", multerUpload.single("image"), plantHandler.editPlant);
// router.delete("/:id", plantHandler.deletePlant);

module.exports = router;
