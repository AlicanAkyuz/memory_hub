const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  location: {
    type: String
  },
  image: {
    type: String
  },
  school: {
    type: String
  },
  profession: {
    type: String
  },
  bio: {
    type: String
  },
  facebook: {
    type: String
  },
  instagram: {
    type: String
  },
  friends: [
    {
      name: {
        type: String
      },
      avatar: {
        type: String
      }
    }
  ],
  friendRequests: [
    {
      name: {
        type: String
      },
      avatar: {
        type: String
      }
    }
  ],
  loginCount: {
    type: Number
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Profile = mongoose.model("profile", ProfileSchema);
