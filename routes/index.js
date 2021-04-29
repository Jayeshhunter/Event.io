const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("index");
});

const authRoutes = require("./authRoutes");
const loe = require("./loe");
const user = require("./user");
const club = require("./club");
const contact = require("./contact");

router.use(authRoutes);
router.use(loe);
router.use(user);
router.use(club);
router.use(contact);

// router.get("/faq", (req, res) => res.render("faq"));
router.get("/aboutus", (req, res) => res.render("aboutus"));
router.get("/getin", (req, res) => res.render("getin"));

module.exports = router;
