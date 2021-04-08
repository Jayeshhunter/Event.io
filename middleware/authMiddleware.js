const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Admin = require("../models/club");
const requireAuth = (req, res, next) => {
  const token = req.cookie.jwt;
  if (token) {
    jwt.verify(token, "secretkey", (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect("/login");
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};

const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, "secretkey", async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        if (user) {
          res.locals.user = user;
          next();
        } else {
          res.redirect("/login");
        }
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

const checkAdmUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, "secretkey", async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        let user = await Admin.findById(decodedToken.id);
        if (user) {
          res.locals.user = user;
          next();
        } else {
          res.redirect("/loginAdm");
        }
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};
module.exports = { requireAuth, checkUser, checkAdmUser };
