const Club = require("../models/club");
const User = require("../models/user");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

module.exports.eventDetailsUser_get = (req, res) => {
  console.log(req.params.id);
  Club.find({ "events._id": req.params.id }, (err, result) => {
    var allInterns = result[0].events.find((x) => x.title === req.params.title);
    console.log(allInterns, result[0].clbName);
    res.render("eventDetailsUser", {
      image: allInterns.imageName,
      details: allInterns.details,
      title: allInterns.title,
      club: result[0].clbName,
      user: req.params.user,
      eventId: req.params.id,
      location: allInterns.location,
    });
  });
};

module.exports.eventDetailsUserF_get = (req, res) => {
  const under = {
    participate: req.params.eventId,
  };
  const token = req.cookies.jwt;
  let decoded = 0;
  if (token) {
    jwt.verify(token, "secretkey", (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect("/login");
      } else {
        decoded = decodedToken.id;
      }
    });
  }
  console.log(decoded);
  let flag = 0;
  User.find({ _id: decoded }, (err, result) => {
    if (result) {
      console.log(result);

      let wal = result[0].events.find(
        (x) => x.participate === req.params.eventId
      );
      if (wal) {
        flag = 1;
      }
    } else {
      console.log(err);
    }
  });
  if (flag === 0) {
    User.findOneAndUpdate(
      { username: req.params.username },
      { $push: { "$.events": under } },
      (err, result) => {
        console.log("events", result);
      }
    );

    User.find({ username: req.params.username }, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        const newtask1 = {
          id: result[0]._id,
          username: result[0].username,
          email: result[0].email,
        };
        console.log(newtask1);
        // const arr = [];
        // arr.push(newtask1);

        Club.findOneAndUpdate(
          { "events.title": req.params.title },
          { $addToSet: { "events.$.reg": newtask1 } },
          { upsert: true },
          (err, result) => {
            if (err) {
              console.log(err);
            } else {
              console.log(result);
              var spt = result.events.find((x) => x.title === req.params.title)
                .gmeet;
              var special = result.events.find(
                (x) => x.title === req.params.title
              ).reg;
              console.log(special);
              res.render("eventDetailsUserf", {
                gmeet: spt,
                location: result.location,
              });
            }
          }
        );
      }
    });
  }
  flag = 0;
};
