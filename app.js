const express = require("express");
const mongoose = require("mongoose");
const router = require("./routes");
const cors = require("cors");
const app = express();
require("dotenv").config();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const path = require("path");
const multer = require("multer");
const authRoutes = require("./routes/authRoutes");
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cors());

app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public/css/")));
app.use(express.static(path.join(__dirname, "public/assests/")));
app.use(express.static(path.join(__dirname, "public/uploads/")));
app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cookieParser());

mongoose
  .connect(
    "mongodb+srv://hackDB:Jayesh@135@cluster0.lev68.mongodb.net/hackDB",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    }
  )
  .then((result) => app.listen(5000))
  .catch((err) => console.log(err));

const Storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + file.originalname);
  },
});

var upload = multer({
  storage: Storage,
}).single("image");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use("/", router);

app.listen(9000, () => {
  console.log("Server Running, HOST:9000");
});
