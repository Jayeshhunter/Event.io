const express = require("express");
const router = express.Router();

const contact = require("../controllers/contactController");
const cors = require("cors");
router.get("/contact", (req, res) => res.render("contact"));
router.post("/contact", contact.post_contact);

module.exports = router;
