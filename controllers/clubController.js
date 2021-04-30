const Club = require("../models/club");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

module.exports.eventDetailsClub_get = (req, res) => {
  res.render("eventDetailsClub", { clb: req.params.clbname });
};

module.exports.eventDetailsClub_post = (req, res) => {
  // console.log(req.body.details);
  console.log(req.file);
  const arObj = {
    image: req.file.path,
    imageName: req.file.filename,
    details: req.body.details,
    gmeet: req.body.gmeet,
    title: req.body.title,
    time: new Date().getTime(),
  };
  Club.findOneAndUpdate(
    { clbName: req.params.clbname },
    { $push: { events: arObj } },
    (err, result) => {
      if (err) {
        res.json(err);
      } else {
        res.redirect("/eventDetailsClubF/" + arObj.title);
      }
    }
  );
};

module.exports.eventDetailsClubF_get = (req, res) => {
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

  Club.find({ _id: decoded }, (err, result) => {
    //console.log(result[0].events[0]);
    // console.log(req.params.eveId);
    // console.log(result);

    if (err) {
      console.log(err);
    }
    console.log(result[0]);
    var allInterns = result[0].events.find((x) => x.title === req.params.eveId)
      .reg;
    //console.log(allInterns);
    var resNew = result[0].events.find((x) => x.title === req.params.eveId);
    console.log(resNew);
    res.render("eventDetailsClubf", {
      image: resNew.imageName,
      details: resNew.details,
      gmeet: resNew.gmeet,
      title: req.params.eveId,
      participants: allInterns,
    });
  });
};
