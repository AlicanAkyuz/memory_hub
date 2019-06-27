import React, { useContext, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import { unstable_useMediaQuery as useMediaQuery } from "@material-ui/core/useMediaQuery";

import Context from "../../context";
import NavBar from "../layout/Navbar";
import UpdateOrCreateProfile from "./UpdateOrCreateProfile";
import UserProfile from "./UserProfile";
import UserMemoryFeed from "./UserMemoryFeed";

const Profile = ({ classes }) => {
  const mobileSize = useMediaQuery("(max-width: 650px)");

  const { state, dispatch } = useContext(Context);

  useEffect(() => {
    return function clear() {
      dispatch({ type: "PROFILE_UPDATE", payload: false });
    };
  }, []);

  // profile content is by default user's profile
  let profileContent = <UserProfile />;

  // render an 'update profile UI' when update is clicked
  if (state.profileUpdate) profileContent = <UpdateOrCreateProfile />;
  // redirect to /map with current memory set to whatever the user clicked on the feed
  if (state.currentPin) profileContent = <Redirect to="/map" />;

  return (
    <div className={mobileSize ? classes.rootMobile : classes.root}>
      <NavBar page="profile" />
      <div
        className={
          mobileSize ? classes.contentContainerMobile : classes.contentContainer
        }
      >
        <div className={mobileSize ? classes.contentMobile : classes.content}>
          {profileContent}
        </div>
        <div className={mobileSize ? classes.feedMobile : classes.feed}>
          <UserMemoryFeed />
        </div>
      </div>
    </div>
  );
};

const styles = {
  root: {
    display: "flex",
    flexDirection: "column",
    width: "100%"
  },
  contentContainer: {
    display: "flex"
  },
  content: {
    width: "50%"
  },
  feed: {
    width: "50%"
  },
  ///////////// MOBILE /////////////
  rootMobile: {
    display: "flex",
    flexDirection: "column",
    width: "100%"
  },
  contentContainerMobile: {
    display: "flex",
    flexDirection: "column"
  },
  contentMobile: {
    width: "100%",
    minWidth: 320
  },
  feedMobile: {
    width: "100%",
    minWidth: 320
  }
};

export default withStyles(styles)(Profile);
