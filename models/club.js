const mongoose = require("mongoose");
// const { isEmail } = require("validator");

const clubSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    lowercase: true,
  },
  clbName: {
    type: String,
    required: [true, "Please enter your club name"],
  },
  parent: {
    type: String,
    default: "NA",
  },
  location: {
    type: String,
    required: true,
  },
  events: [
    {
      image: String,
      imageName: String,
      details: String,
      gmeet: String,
      title: String,
      time: String,
      status: String,
      reg: [
        {
          _id: false,
          id: String,
          username: String,
          email: String,
        },
      ],
    },
  ],
});
// Function fired after the new user saved
// userSchema.post("save", function (doc, next) {
//   console.log("New user was created & saved");
//   next();
// });
// Fire a function before the doc is saved
clubSchema.pre("save", function (next) {
  console.log("User about to be created", this);
  next();
});

// static method to login user
clubSchema.statics.login = async function (hid) {
  const user = await this.findOne({ clbName: hid });
  if (user) {
    return user;
  }
  throw Error("incorrect id");
};

const Club = mongoose.model("club", clubSchema);
module.exports = Club;
