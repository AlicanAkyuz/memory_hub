import { createContext } from "react";

const Context = createContext({
  signup: false, // toggle register or login screens
  isAuth: false, // authenticate user through either localStorage or logging in
  user: {}, // hold user data; id, avatar, name, latitude and longitude
  memories: [], // hold user/other users' memories upon /map // /discover mounting
  currentPin: null, // hold single memory; either to observe in /map
  currentAuthor: {}, // hold author info of currentPin in Discover & Friend Profile
  draft: null, // hold draft memory's lat and long
  comments: [], // hold a memory's comments; cleared upon dismounting
  profile: {}, // hold user's profile info
  profileUpdate: false, // render update screen if no profile or for profile update
  friendProfile: null, // hold friend's profile info, rendered in FriendProfile
  friendMemories: null // friend's memories to be rendered in friend memory feed
});

export default Context;
