const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const path = require("path");

// bring in route files
const users = require("./routes/users");
const profile = require("./routes/profile");
const pins = require("./routes/pins");

const app = express();

// body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB Config
const db = require("./config/keys").mongoURI;

// passport middleware
app.use(passport.initialize());

// passport config for password strategy
require("./config/passport")(passport);

// bring in route files and indicate them to routes
app.use("/users", users);
app.use("/profile", profile);
app.use("/pins", pins);

// Set server static assets if in production
if (process.env.NODE_ENV === "production") {
  // set static folder
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

//Connect to mongoDB throguh mongoose
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("MongoDb Conencted"))
  .catch(err => console.log(err));

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server running on port ${port}`));
