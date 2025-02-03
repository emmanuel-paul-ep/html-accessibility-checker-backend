const express = require("express");
const { uploadFile } = require("../controllers/uploadController");
const multer = require("multer");

const router = express.Router();

const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/upload", upload.single("file"), uploadFile);

module.exports = router;
