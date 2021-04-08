const express = require("express");
const router = express.Router();

const users = require("../controllers/userController");
const cors = require("cors");
const { checkAdmUser, checkUser } = require("../middleware/authMiddleware");
router.get(
  "/eventDetailsUser/:id/:title/:user",
  cors(),
  checkUser,
  users.eventDetailsUser_get
);

router.get(
  "/eventDetailsUserF/:username/:eventId/:title",
  cors(),
  checkUser,
  users.eventDetailsUserF_get
);

module.exports = router;
