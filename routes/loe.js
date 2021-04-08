const express = require("express");
const router = express.Router();

const loe = require("../controllers/listofevent");
const cors = require("cors");
const { checkAdmUser, checkUser } = require("../middleware/authMiddleware");
router.get("/loeUser/:username", cors(), checkUser, loe.loeUser_get);

router.get("/loeClub/:clbname", cors(), checkAdmUser, loe.loeClub_get);

module.exports = router;
