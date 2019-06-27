const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");

// bring in register and login validation functions
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");

// bring in keys
const keys = require("../config/keys");

// bring in user model
const User = require("../models/User");
const Profile = require("../models/Profile");

// @route   POST /users/register
// @desc    register a user if not already exists
// @access  public
router.post("/register", async (req, res) => {
  // validate register input
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) return res.status(400).json(errors);

  try {
    const emailCheck = await User.findOne({ email: req.body.email });
    const nameCheck = await User.findOne({ name: req.body.name });

    if (emailCheck) {
      // if email already exists
      errors.email = "Email already exists";
      return res.status(400).json(errors);
    } else if (nameCheck) {
      // if name already exists
      errors.name = "Username already exists";
      return res.status(400).json(errors);
    } else {
      // pull avatar from email address if there is one
      const avatar = gravatar.url(req.body.email, {
        s: "200", // size
        r: "pg", // rating
        d: "mm" // default
      });

      // create resource in mongoose based on user model
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });

      // create hashed password for new user to be saved in db
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) {
            throw err;
          }
          newUser.password = hash;
          newUser
            .save()
            .then(user => {
              // if user created successfully, create an empty profile on DB
              const profileFields = {
                user,
                location: "",
                image: avatar,
                school: "",
                profession: "",
                bio: "",
                facebook: "",
                instagram: "",
                friends: [],
                friendRequests: []
              };

              const profile = new Profile(profileFields).save();
              res.json(user);
            })
            .catch(err => console.log({ newUserError: err }));
        });
      });
    }
  } catch (err) {
    errors.server = "There has been a server problem";
    return res.status(400).json(errors);
  }
});

// @route   POST /users/login
// @desc    login user returning JWT token
// @access  Public
router.post("/login", async (req, res) => {
  // validate login input
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) return res.status(400).json(errors);

  const email = req.body.email;
  const password = req.body.password;

  // find user by email
  try {
    const user = await User.findOne({ email });

    if (!user) {
      errors.email = "Email not found";
      return res.status(404).json(errors);
    }

    // if user exists, check if password correct
    // first compare the hashed password on db with user's req
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // create jwt payload
        const payload = { id: user.id, name: user.name, avatar: user.avatar };

        // sign jwt token and send it to client
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 10000 },
          (err, token) => {
            // check if error and send the token if not
            if (err) {
              errors.server = "There has been a server problem";
              return res.status(400).json(errors);
            } else {
              res.json({
                success: true,
                token: "Bearer " + token
              });
            }
          }
        );
      } else {
        errors.password = "Password is incorrect";
        return res.status(400).json(errors);
      }
    });
  } catch (err) {
    errors.server = "There has been a server problem";
    return res.status(400).json(errors);
  }
});

// @route   GET users/current
// @desc    return the current user whoever the token belongs to
// @access  private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar
    });
  }
);

// @route   GET users/:name
// @desc    get a user by name
// @access  private
router.get(
  "/:name",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const user = await User.findOne({ name: req.params.name });
      return res.json(user);
    } catch (err) {
      const errors = {
        msg: "There has been a server problem"
      };
      return res.status(400).json(errors);
    }
  }
);

module.exports = router;
