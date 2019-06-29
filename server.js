const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const path = require("path");

const port = process.env.PORT || 3001;

// bring in route files
const users = require("./routes/users");
const profile = require("./routes/profile");
const pins = require("./routes/pins");

const app = express();

// body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// cross origin resource sharing
const corsOptions = {
  origin: port,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

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

if (process.env.NODE_ENV === "production") {
  app.use(express.static("cli/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "cli", "build", "index.html"));
  });
}

//Connect to mongoDB throguh mongoose
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("MongoDb Conencted"))
  .catch(err => console.log(err));

app.listen(port, () => console.log(`Server running on port ${port}`));
