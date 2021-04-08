const Club = require("../models/club");

module.exports.loeUser_get = (req, res) => {
  Club.find({}, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(req.params.username);

      res.render("listEventsUser", {
        user: req.params.username,
        array: result,
      });
    }
  });
};

module.exports.loeClub_get = (req, res) => {
  console.log(req.params.clbname);
  Club.find({ clbName: req.params.clbname }, (err, result) => {
    console.log(result);
    res.render("listEventsClub", {
      clbname: req.params.clbname,
      array: result[0].events,
    });
  });
};
