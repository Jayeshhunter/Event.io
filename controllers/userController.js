const Club = require("../models/club");
const User = require("../models/user");

module.exports.eventDetailsUser_get = (req, res) => {
  Club.find({ "events._id": req.params.id }, (err, result) => {
    var allInterns = result[0].events.find((x) => x.title === req.params.title);

    res.render("eventDetailsUser", {
      image: allInterns.imageName,
      details: allInterns.details,
      title: allInterns.title,
      club: result.clbName,
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
  let flag = 0;
  User.find({ username: req.params.username }, (err, result) => {
    if (result) {
      let wal = result.events.find((x) => x.participate === req.params.eventId);
      if (wal) {
        flag = 1;
      }
    }
  });
  if (flag === 0) {
    User.findOneAndUpdate(
      { username: req.params.username },
      { $push: { "$.events": under } },
      (err, result) => {
        console.log(result);
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
