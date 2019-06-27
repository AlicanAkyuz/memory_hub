import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import { unstable_useMediaQuery as useMediaQuery } from "@material-ui/core/useMediaQuery";

import Context from "../../context";

import NavBar from "../layout/Navbar";
import FriendProfile from "./FriendProfile";
import FriendMemoryFeed from "./FriendMemoryFeed";
import Loading from "../pages/Loading";

const Friend = ({ classes }) => {
  const mobileSize = useMediaQuery("(max-width: 650px)");

  const { state, dispatch } = useContext(Context);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState(false);

  // get friend's profile & memories
  useEffect(() => {
    const getFriendProfileAndMemories = async () => {
      try {
        const { data, statusText } = await axios.get(
          `/profile/friend/${state.currentAuthor.name}`
        );

        if (statusText === "OK") {
          await dispatch({ type: "FRIEND_PROFILE", payload: data });

          // get friend's memories
          try {
            const res = await axios.get(
              `/pins/friend/${state.currentAuthor.name}`
            );
            if (res.statusText === "OK") {
              dispatch({ type: "FRIEND_MEMORIES", payload: res.data });
              setLoading(false);
            }
          } catch (err) {
            setErrors(true);
            setLoading(false);
          }
        }
      } catch (err) {
        setErrors(true);
        setLoading(false);
      }
    };
    getFriendProfileAndMemories();
  }, []);

  // redirect to discover page upon click on 'view memory'
  if (state.currentPin) return <Redirect to="/map" />;

  // return circularprogress until friend's profile is pulled
  if (loading) {
    return (
      <div style={{ height: "calc(100vh - 64px)" }}>
        <NavBar page="profile" />
        <Loading />
      </div>
    );
  }

  // handle errors
  if (errors) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%"
        }}
      >
        <h1 className={classes.errorMessage}>
          There has been a server problem, please try again.
        </h1>
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <NavBar page="profile" />
      <div
        className={
          mobileSize ? classes.contentContainerMobile : classes.contentContainer
        }
      >
        <div className={mobileSize ? classes.profileMobile : classes.profile}>
          <FriendProfile />
        </div>
        <div className={mobileSize ? classes.feedMobile : classes.feed}>
          <FriendMemoryFeed />
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
    display: "flex",
    width: "100%"
  },
  profile: {
    width: "50%"
  },
  feed: {
    width: "50%"
  },
  errorMessage: {
    fontFamily: "Oswald",
    fontSize: "55px",
    color: "#ffca28",
    marginBottom: 12
  },
  ////////// MOBILE ///////////
  contentContainerMobile: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    marginTop: "57px"
  },
  profileMobile: {
    width: "100%",
    minWidth: 320
  },
  feedMobile: {
    width: "100%",
    minWidth: 320
  }
};

export default withStyles(styles)(Friend);
