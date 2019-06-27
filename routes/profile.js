const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// bring in profile validation functions
const validateProfileInput = require("../validation/profile");

// bring in profile and user models
const Profile = require("../models/Profile");
const User = require("../models/User");

// @route   GET /profile
// @desc    get current user's profile
// @access  private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const errors = {};
    // fetch the current user's profile
    try {
      const profile = await Profile.findOne({ user: req.user.id }).populate(
        "user",
        ["name", "avatar"]
      );
      if (!profile) {
        res.json({});
      }
      res.json(profile);
    } catch (err) {
      errors.noprofile = "There has been a problem with fetching user";
      res.status(404).json(errors);
    }
  }
);

// @route:  GET for /profile/:user_id
// @desc:   get a profile by user id
// @access: private
router.get(
  "/:user_id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const errors = {};

    try {
      const profile = await Profile.findOne({
        user: req.params.user_id
      }).populate("user", ["name", "avatar"]);

      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        res.status(404).json(errors);
      }
      res.json(profile);
    } catch (err) {
      errors.noprofile = "There is no profile for this user";
      res.status(404).json(errors);
    }
  }
);

// @route:  POST /profile
// @desc:   create or update user's profile
// @access: private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);
    // check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    //update avatar on User object if user uploads a new image
    if (req.body.image) {
      try {
        const user = await User.findOneAndUpdate(
          { _id: req.user.id },
          { $set: { avatar: req.body.image } },
          { new: true }
        );
      } catch (err) {
        errors.avatar = "There had been a problem with uploading avatar";
        res.status(400).json(errors);
      }
    }

    // get the profile fields from req to populate profile
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.image) profileFields.image = req.body.image;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.school) profileFields.school = req.body.school;
    if (req.body.profession) profileFields.profession = req.body.profession;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.facebook) profileFields.facebook = req.body.facebook;
    if (req.body.instagram) profileFields.instagram = req.body.instagram;

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        // Profile already exists, update profile
        try {
          const profile = await Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileFields },
            { new: true }
          );
          res.json(profile);
        } catch (err) {
          errors.update = "There had been a problem with updating profile";
          res.status(400).json(errors);
        }
      } else {
        // Profile does not exist, create profile
        try {
          const profile = await new Profile(profileFields).save();
          res.json(profile);
        } catch (err) {
          errors.create = "There had been a problem with creating profile";
          res.status(400).json(errors);
        }
      }
    } catch (err) {
      errors.create = "There had been a problem with creating profile";
      res.status(400).json(errors);
    }
  }
);

// @route:  DELETE /profile
// @desc:   delete user and user profile
// @access: private
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const errors = {};
    try {
      await Profile.findOneAndRemove({ user: req.user.id });
      await User.findOneAndRemove({ _id: req.user.id });
      res.json({ success: true });
    } catch (err) {
      errors.delete = "There had been a problem with deleting user";
      res.status(400).json(errors);
    }
  }
);

// *************************** FRIENDS *************************

// @route:  GET for /profile/friend/:user_name
// @desc:   get the profile of a friend by friend's username
// @access: private
router.get(
  "/friend/:user_name",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const errors = {};
    try {
      // pull the _id of the friend
      const { _id } = await User.findOne({ name: req.params.user_name });
      // pull the profile of the friend through their _id
      const profile = await Profile.findOne({ user: _id });
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        res.status(404).json(errors);
      }
      res.json(profile);
    } catch (err) {
      errors.noprofile = "There is no profile for this user";
      res.status(404).json(errors);
    }
  }
);

// @route:  GET /profile/friends/requests/:author
// @desc:   get an author (of a pin)'s friend requests by their name
// @access: private
router.get(
  "/friends/requests/:author",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      // pull the author's id through their name
      const { _id } = await User.findOne({ name: req.params.author });

      // get the friend requests of the author
      const { friendRequests } = await Profile.findOne({ user: _id });
      if (friendRequests) {
        res.json(friendRequests);
      } else {
        const errors = {
          error: "User has no friend requests"
        };
        res.status(400).json(errors);
      }
    } catch (err) {
      const errors = {
        error: "User has no friend requests"
      };
      res.status(400).json(errors);
    }
  }
);

// @route:  GET /profile/friends/requests
// @desc:   get current user's friend requests
// @access: private
router.get(
  "/friends/requests",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { friendRequests } = await Profile.findOne({ user: req.user.id });
      if (friendRequests) res.json(friendRequests);
    } catch (err) {
      const errors = {
        error: "User has no friend requests"
      };
      res.status(400).json(errors);
    }
  }
);

// @route:  GET /profile/friends/all
// @desc:   get current user's friends
// @access: private
router.get(
  "/friends/all",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { friends } = await Profile.findOne({ user: req.user.id });
      if (friends) res.json(friends);
    } catch (err) {
      const errors = {
        error: "User has no friends"
      };
      res.status(400).json(errors);
    }
  }
);

// @route   POST /profile/friends/requests
// @desc    add user to the receiver's requests list
// @body    name: the name of the user request sent
// @access  private
router.post(
  "/friends/requests",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      // pull sender's name and avatar through their id
      const { name, avatar } = await User.findOne({ _id: req.user.id });

      // pull the receiver's id through their name
      const { _id } = await User.findOne({ name: req.body.name });

      // pull the receiver's profile through their _id
      const receiverProfile = await Profile.findOne({ user: _id });

      // check to see if the receiver is already friends or has a friend request by the user
      const isFriends = receiverProfile.friends.find(
        friend => friend.name === name
      );
      const isAlreadyAdded = receiverProfile.friendRequests.find(
        request => request.name === name
      );

      if (isFriends !== undefined) {
        res.status(400).json("User is already friends with this person");
      }

      if (isAlreadyAdded !== undefined) {
        res.status(400).json("User has already added this person as a friend");
      }

      // copy requests array and push the new request to it
      const newArr = [...receiverProfile.friendRequests];
      newArr.push({ name, avatar });

      // update the receivers requests arr by replacing it with the new one
      const updatedProfile = await Profile.findOneAndUpdate(
        { user: _id },
        { $set: { friendRequests: newArr } },
        { new: true }
      );

      // return the requests arr
      if (updatedProfile) {
        res.send(updatedProfile.friendRequests);
      }
    } catch (err) {
      const errors = {
        error: "There had been a problem with sending the friend request"
      };
      res.status(400).json(errors);
    }
  }
);

// @route   POST /profile/friends
// @desc    add a friend to user's friend list and the friend's friend list
// @body    name: accepted user's name
// @access  private
router.post(
  "/friends",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      // pull info of addee and adder
      const addee = await User.findOne({ name: req.body.name });
      const addeeInfo = {
        name: addee.name,
        avatar: addee.avatar,
        _id: addee._id
      };

      const adder = await User.findOne({ _id: req.user.id });
      const adderInfo = {
        name: adder.name,
        avatar: adder.avatar,
        _id: adder._id
      };

      // pull profiles of addee and adder
      const addeeProfile = await Profile.findOne({ user: addeeInfo._id });
      const adderProfile = await Profile.findOne({ user: adderInfo._id });

      // check if they are already friends
      const isFriends = addeeProfile.friends.find(
        friend => friend.name === adderInfo.name
      );
      if (!isFriends === undefined)
        return res.status(400).json("Already friends");

      // if not, copy addee's friends array, push the adder to it, and save new arr
      const newArrOfAddee = [...addeeProfile.friends];
      newArrOfAddee.push(adderInfo);

      const updatedAddeeProfile = await Profile.findOneAndUpdate(
        { user: addeeInfo._id },
        { $set: { friends: newArrOfAddee } },
        { new: true }
      );

      // copy adder's friends array, push the addee to it, and save new arr
      const newArrOfAdder = [...adderProfile.friends];
      newArrOfAdder.push(addeeInfo);

      const updatedAdderProfile = await Profile.findOneAndUpdate(
        { user: adderInfo._id },
        { $set: { friends: newArrOfAdder } },
        { new: true }
      );

      // filter adder's requests array to exclude the addee from it, and save new arr
      const filteredRequests = adderProfile.friendRequests.filter(
        request => request.name !== addeeInfo.name
      );

      const finalAdderProfile = await Profile.findOneAndUpdate(
        { user: adderInfo._id },
        { $set: { friendRequests: filteredRequests } },
        { new: true }
      );

      // return the full profile
      if (finalAdderProfile) {
        res.send(finalAdderProfile);
      }
    } catch (err) {
      const errors = {
        error: "There had been a problem with adding the friend"
      };
      res.status(400).json(errors);
    }
  }
);

// @route   DELETE /profile/friends/requests/:name
// @desc    cancel request: delete user from the requests of the one previously added
// @params  name: the name of the one previously added
// @access  private
router.delete(
  "/friends/requests/:name",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      // previously added user
      const previouslyAdded = await User.findOne({ name: req.params.name });

      // previously added user's profile
      const addedProfile = await Profile.findOne({ user: previouslyAdded._id });

      // current user
      const { name } = await User.findOne({ _id: req.user.id });

      // filter added user's requests to exclude the user
      const filteredRequests = addedProfile.friendRequests.filter(
        request => request.name !== name
      );

      // set new requests arr
      const previouslyAddedNewProfile = await Profile.findOneAndUpdate(
        { user: previouslyAdded._id },
        { $set: { friendRequests: filteredRequests } },
        { new: true }
      );

      // return the full profile of the previously added
      if (previouslyAddedNewProfile) {
        res.send(previouslyAddedNewProfile);
      }
    } catch (err) {
      const errors = {
        error: "There had been a problem with cancelling friend request"
      };
      res.status(400).json(errors);
    }
  }
);

// @route   DELETE /profile/friends/requests/decline/:name
// @desc    decline request: delete the requesting party from user's requests
// @params  name: the name of the requesting party
// @access  private
router.delete(
  "/friends/requests/decline/:name",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      // user's profile
      const userProfile = await Profile.findOne({ user: req.user.id });

      // filter user's requests to exclude the requesting party
      const filteredRequests = userProfile.friendRequests.filter(
        request => request.name !== req.params.name
      );

      // set new requests arr of the user
      const userNewProfile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: { friendRequests: filteredRequests } },
        { new: true }
      );

      // return the full profile of the user
      if (userNewProfile) {
        res.send(userNewProfile);
      }
    } catch (err) {
      const errors = {
        error: "There had been a problem with declining friend request"
      };
      res.status(400).json(errors);
    }
  }
);

// @route   DELETE /profile/friends/:name
// @desc    delete friend from user's friends and the user from friend's friends
// @params  name: the name of the friend to be deleted
// @access  private
router.delete(
  "/friends/:name",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      // user's profile
      const user = await User.findOne({ _id: req.user.id });
      const userProfile = await Profile.findOne({ user: req.user.id });

      // friend's profile
      const friend = await User.findOne({ name: req.params.name });
      const friendProfile = await Profile.findOne({
        user: friend._id
      });

      // filter the friend's friends to exclude the user
      const filteredFriendsOfFriend = friendProfile.friends.filter(
        friend => friend.name !== user.name
      );

      // set new friends arr of the friend
      const friendNewProfile = await Profile.findOneAndUpdate(
        { user: friend._id },
        { $set: { friends: filteredFriendsOfFriend } },
        { new: true }
      );

      // filter user's friends to exclude the friend
      const filteredFriends = userProfile.friends.filter(
        friend => friend.name !== req.params.name
      );

      // set new friends arr of the user
      const userNewProfile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: { friends: filteredFriends } },
        { new: true }
      );

      // return the full profile of the user
      if (userNewProfile) {
        res.send(userNewProfile);
      }
    } catch (err) {
      const errors = {
        error: "There had been a problem with deleting friend"
      };
      res.status(400).json(errors);
    }
  }
);

module.exports = router;
