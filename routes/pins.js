const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// bring in pin and comment validation functions
const validatePinInput = require("../validation/pin");
const validateCommentInput = require("../validation/comment");

// bring in pin model
const Pin = require("../models/Pin");

// @route   GET /pins/me_pins
// @desc    get current user's pins (token must be included in the header as authorization)
// @access  private
router.get(
  "/me_pins",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const errors = {};

    // fetch the current user's pins
    try {
      const pins = await Pin.find({ author: req.user.name });
      if (!pins) {
        errors.nopin = "There is no pin found for this user";
        return res.status(404).json(errors);
      }
      res.json(pins);
    } catch (err) {
      errors.nopin = "There has been a problem with fetching user's pins";
      res.status(404).json(errors);
    }
  }
);

// @route   GET /pins/friend/:frined_name
// @desc    get the memories of a friend by their name
// @access  private
router.get(
  "/friend/:frined_name",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const errors = {};

    // fetch friend's memories
    try {
      const pins = await Pin.find({ author: req.params.frined_name });
      if (!pins) {
        errors.nopin = "There is no pin found for this user";
        return res.status(404).json(errors);
      }
      res.json(pins);
    } catch (err) {
      errors.nopin = "There has been a problem with fetching user's pins";
      res.status(404).json(errors);
    }
  }
);

// @route:  GET pins/all
// @desc:   get all pins (token must be included in the header as authorization)
// @access: private
router.get(
  "/all",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const errors = {};

    try {
      const pins = await Pin.find();
      if (!pins) {
        errors.nopins = "There are no pins";
        return res.status(404).json(errors);
      }
      res.json(pins);
    } catch (err) {
      errors.nopins = "There are no pins";
      return res.status(404).json(errors);
    }
  }
);

// @route:  GET pins/:pin_id
// @desc:   get pin by id (token must be included in the header as authorization)
// @access: private
router.get(
  "/:pin_id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const errors = {};

    try {
      const pin = await Pin.findById(req.params.pin_id);
      if (pin) {
        return res.json(pin);
      } else {
        errors.pin = "There is no pin with this ID found";
        res.status(404).json(errors);
      }
    } catch (err) {
      errors.pin = "There is no pin with this ID found";
      res.status(404).json(errors);
    }
  }
);

// @route:  POST /pins
// @desc:   create pin (token must be included in the header as authorization)
// @access: private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { errors, isValid } = validatePinInput(req.body);

    // check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    // get pin fields from req to populate pin
    const pinFields = {
      author: req.body.author,
      title: req.body.title,
      content: req.body.content,
      image: req.body.image,
      latitude: req.body.latitude,
      longitude: req.body.longitude
    };

    // create and save pin
    try {
      const pin = await new Pin(pinFields).save();
      res.json(pin);
    } catch (err) {
      errors.create = "There has been a problem with creating pin";
      res.status(400).json(errors);
    }
  }
);

// @route:  POST /pins/comments
// @desc:   create new comment (token must be included in the header as authorization)
// @access: private
router.post(
  "/comments",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { errors, isValid } = validateCommentInput(req.body);

    // check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    // find the commenting user
    try {
      const user = await User.findOne({ _id: req.user.id });
      if (!user) {
        errors.user = "There is no user registered with this id";
        res.status(400).json(errors);
      } else {
        // create commentFields
        const commentFields = {
          author: req.user.id,
          text: req.body.text,
          name: user.name,
          avatar: user.avatar
        };

        // find pin and add comment to it
        try {
          const pin = await Pin.findOne({ _id: req.body.pin_id });
          if (pin) {
            pin.comments.unshift(commentFields);
            pin.save().then(pin => res.json(pin.comments[0]));
          } else {
            errors.pin = "There has been a problem with creating comment";
            res.status(400).json(errors);
          }
        } catch (err) {
          errors.pin = "There has been a problem with creating comment";
          res.status(400).json(errors);
        }
      }
    } catch (err) {
      errors.pin = "There has been a problem with creating comment";
      res.status(400).json(errors);
    }
  }
);

// @route:  DELETE /pins/:pin_id
// @desc:   delete pin (token must be included in the header as authorization)
// @access: private
router.delete(
  "/:pin_id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const errors = {};

    try {
      const pin = await Pin.findOne({ _id: req.params.pin_id });
      // check if the user sending the request is the owner of the pin
      if (pin.author !== req.user.name) {
        errors.delete = "This user is not authorized to delete this pin";
        return res.status(400).json(errors);
      } else {
        try {
          await Pin.findOneAndRemove({ _id: req.params.pin_id });
          res.json({ success: true });
        } catch (err) {
          errors.delete = "There had been a problem with deleting pin";
          res.status(400).json(errors);
        }
      }
    } catch (err) {
      errors.delete = "There had been a problem with deleting pin";
      res.status(400).json(errors);
    }
  }
);

// @route:  DELETE /pins/:pin_id/:comment_id
// @desc:   delete comment (token must be included in the header as authorization)
// @access: private
router.delete(
  "/:pin_id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const errors = {};

    try {
      const pin = await Pin.findOne({ _id: req.params.pin_id });
      // check if the user sending the request is the owner of the pin
      if (pin.author !== req.user.name) {
        errors.delete = "This user is not authorized to delete this comment";
        return res.status(400).json(errors);
      } else {
        // filter the found pin's comments
        pin.comments = pin.comments.filter(
          comment => comment._id.toString() !== req.params.comment_id
        );
        // save the pin whose comments is now filtered
        try {
          const savedPin = await pin.save();
          res.json({ success: true });
        } catch (err) {
          errors.delete = "There had been a problem with deleting comment";
          res.status(400).json(errors);
        }
      }
    } catch (err) {
      errors.delete = "There had been a problem with deleting comment";
      res.status(400).json(errors);
    }
  }
);

module.exports = router;
