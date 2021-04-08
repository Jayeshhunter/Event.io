const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("index");
});

const authRoutes = require("./authRoutes");
const loe = require("./loe");
const user = require("./user");
const club = require("./club");

router.use(authRoutes);
router.use(loe);
router.use(user);
router.use(club);

router.get("/getin", (req, res) => res.render("getin"));

module.exports = router;
