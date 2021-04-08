const User = require("../models/user");

const Club = require("../models/club");
const jwt = require("jsonwebtoken");
const handleError = (err) => {
  //   console.log(err.message, err.code);
  let errors = { message: "" };

  //duplicate error code
  errors.message = "User Already exists";

  return errors;
};
const maxAge = 3 * 24 * 60 * 60;
const createToken = function (id) {
  return jwt.sign({ id }, "secretkey", {
    expiresIn: maxAge,
  });
};
module.exports.signup_get = (req, res) => {
  res.render("signup");
};
module.exports.signAdminup_get = (req, res) => {
  res.render("signAdm");
};
module.exports.login_get = (req, res) => {
  res.render("login");
};
module.exports.signup_post = async (req, res) => {
  const { email, username } = req.body;
  try {
    const member = await User.create({ email, username });
    // const eventDef = await Event.create(ans);
    const token = createToken(member._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.redirect("/loeUser/" + username);
  } catch (err) {
    console.log(err);
    res.redirect("/login");
  }
};
module.exports.signAdminup_post = async (req, res) => {
  const { email, clbName, parent, location } = req.body;
  console.log(email, clbName, parent, location);
  try {
    const admin = await Club.create({ email, clbName, parent, location });
    const token = createToken(admin._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.redirect("/loeClub/" + clbName);
  } catch (err) {
    console.log(err);
    res.redirect("/loginAdm");
  }
};
module.exports.login_post = async (req, res) => {
  const { username } = req.body;

  try {
    const user = await User.login(username);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.redirect("/loeUser/" + username);
  } catch (err) {
    console.log(err);
    res.redirect("/signup");
  }
};
module.exports.loginAdm_get = (req, res) => {
  res.render("loginAdm");
};
module.exports.loginAdm_post = async (req, res) => {
  const { clbName } = req.body;

  try {
    const user = await Club.login(clbName);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.redirect("/loeClub/" + clbName);
  } catch (err) {
    console.log(err);
    res.redirect("/signAdminup");
  }
};
