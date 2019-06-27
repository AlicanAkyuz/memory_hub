import isEmpty from "./utils/IsEmpty";

export default function reducer(state, { type, payload }) {
  switch (type) {
    // render login or register screens upon toggling
    case "SIGNUP_CLICK":
      return {
        ...state,
        signup: !state.signup
      };
    // log user in either through localStorage or logging in in Login
    case "AUTH":
      return {
        ...state,
        isAuth: payload
      };
    // set user upon logging in either through localStorage or logging in in Login
    case "SET_USER":
      return {
        ...state,
        isAuth: !isEmpty(payload),
        user: payload
      };
    // set user memories (upon /map mounting)
    // or other users' memories (upon /discover mounting)
    case "MEMORIES":
      return {
        ...state,
        memories: payload
      };
    // set a single memory when clicked on a pin in /map
    case "SET_PIN":
      return {
        ...state,
        currentPin: payload,
        draft: null
      };
    // set author of the currentPin in Discover & Friend Type
    case "SET_PIN_AUTHOR":
      return {
        ...state,
        currentAuthor: payload
      };
    // set or clear draft draft when clicked on the map: in Map & CreateMemory
    case "DRAFT":
      return {
        ...state,
        currentPin: null,
        draft: payload
      };
    // set a memory's comments
    case "COMMENTS":
      return {
        ...state,
        comments: payload
      };
    // set user's profile
    case "PROFILE":
      return {
        ...state,
        profile: payload
      };
    // set profileUpdate state to render diff components within /profile
    case "PROFILE_UPDATE":
      return {
        ...state,
        profileUpdate: payload
      };
    // set friend's profile to be rendered in Profile
    case "FRIEND_PROFILE":
      return {
        ...state,
        friendProfile: payload
      };
    // set friend's memories to be rendered in friend memory feed
    case "FRIEND_MEMORIES":
      return {
        ...state,
        friendMemories: payload
      };
    default:
      return state;
  }
}
