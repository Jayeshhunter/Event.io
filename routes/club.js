const express = require("express");
const router = express.Router();

const club = require("../controllers/clubController");
const cors = require("cors");
const multer = require("multer");
const { checkAdmUser, checkUser } = require("../middleware/authMiddleware");
const Storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + file.originalname);
  },
});

var upload = multer({
  storage: Storage,
}).single("image");

router.get(
  "/eventDetailsClub/:clbname",
  cors(),
  checkAdmUser,
  club.eventDetailsClub_get
);
router.post(
  "/eventDetailsClub/:clbname",
  cors(),
  upload,
  checkAdmUser,
  club.eventDetailsClub_post
);

router.get(
  "/eventDetailsClubF/:eveId",
  cors(),
  checkAdmUser,
  club.eventDetailsClubF_get
);

module.exports = router;
