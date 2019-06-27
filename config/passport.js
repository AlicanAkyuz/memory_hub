const JtwStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const User = mongoose.model("users");
const keys = require("./keys");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
  // check credentials for protected routes

  passport.use(
    new JtwStrategy(opts, (jwt_payload, done) => {
      // get the user sent in the token for users/current
      User.findById(jwt_payload.id)
        .then(user => {
          // if user found, send user back
          if (user) return done(null, user);
          return done(null, false);
        })
        .catch(err => console.log(err));
    })
  );
};
