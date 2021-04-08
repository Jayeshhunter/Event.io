const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  _id: String,
  details: {
    type: String,
    default: "NA",
  },
  image: {
    type: String,
    default: "NA",
  },
  imageName: {
    type: String,
    default: "NA",
  },
  youtb: {
    type: String,
    default: "NA",
  },
  gmeetOrZoom: {
    type: String,
    default: "NA",
  },
  username: {
    type: String,
    required: [true, "Please enter an username"],
  },
});

// Function fired after the new user saved
// userSchema.post("save", function (doc, next) {
//   console.log("New user was created & saved");
//   next();
// });
// Fire a function before the doc is saved
eventSchema.pre("save", function (next) {
  console.log("User about to be created", this);
  next();
});

const Event = mongoose.model("event", eventSchema);
module.exports = Event;
