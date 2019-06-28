import React, { useContext, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import ExploreIcon from "@material-ui/icons/Explore";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";

import { unstable_useMediaQuery as useMediaQuery } from "@material-ui/core/useMediaQuery";

import Context from "../../context";
import withRoot from "../../withRoot";
import FriendRequests from "./FriendRequests";
import SignOut from "../auth/SignOut";

const NavBar = ({ page, classes }) => {
  const mobileSize = useMediaQuery("(max-width: 650px)");

  const { state, dispatch } = useContext(Context);
  const { user, profile } = state;

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const res = await axios.get("/profile");
        if (res.statusText === "OK") {
          dispatch({ type: "PROFILE", payload: res.data });
        } else {
          dispatch({ type: "PROFILE", payload: {} });
        }
      } catch (err) {
        dispatch({ type: "PROFILE", payload: {} });
      }
    };

    getUserProfile();
  }, []);

  return (
    <AppBar
      position="static"
      className={mobileSize ? classes.appbarMobile : classes.appbar}
    >
      <Toolbar className={mobileSize ? classes.toolbarMobile : classes.toolbar}>
        <Typography style={{ display: "block", flexGrow: 1 }}>
          <Link className={classes.logo} to="/map">
            <ExploreIcon
              className={
                mobileSize ? classes.exploreIconMobile : classes.exploreIcon
              }
            />

            {mobileSize ? "" : "Memory Hub"}
          </Link>
        </Typography>

        <Button
          className={mobileSize ? classes.buttonMobile : classes.button}
          color={page === "map" ? "primary" : "secondary"}
          disabled={page === "map" ? true : false}
        >
          <Link
            className={
              page === "map" ? `${classes.linkSelected}` : `${classes.link}`
            }
            to="/map"
          >
            Memory Hub
          </Link>
        </Button>

        <Button
          className={mobileSize ? classes.buttonMobile : classes.button}
          color={page === "profile" ? "primary" : "secondary"}
          disabled={page === "profile" ? true : false}
        >
          <Link
            className={
              page === "profile" ? `${classes.linkSelected}` : `${classes.link}`
            }
            to="/profile"
          >
            Profile
          </Link>
        </Button>

        <FriendRequests />

        <Link className={classes.logo} to="/profile">
          <Avatar
            alt={user.name}
            src={profile && profile.image ? profile.image : user.avatar}
            className={mobileSize ? classes.avatarMobile : classes.avatar}
          />
        </Link>

        <SignOut />
      </Toolbar>
    </AppBar>
  );
};

const styles = theme => ({
  logo: {
    display: "flex",
    alignItems: "center",
    color: "#dcdcdc",
    fontFamily: "Fredericka the Great",
    fontSize: "22px",
    fontStyle: "italic",
    textDecoration: "none"
  },
  icon: {
    color: "#dcdcdc",
    marginRight: theme.spacing.unit,
    fontSize: 15
  },
  button: {
    marginRight: "3%"
  },
  link: {
    textDecoration: "none",
    color: "#dcdcdc",
    fontFamily: "Roboto",
    fontWeight: 400
  },
  linkSelected: {
    textDecoration: "none",
    color: "#dcdcdc",
    borderBottom: "1px solid #dcdcdc",
    fontFamily: "Roboto",
    fontWeight: 400
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: "80%",
    marginRight: theme.spacing.unit * 5
  },
  exploreIcon: {
    margin: theme.spacing.unit,
    fontSize: "30px",
    color: theme.palette.secondary.dark
  },
  ////////////////////// MOBILE //////////////////////
  appbarMobile: {
    width: "100%",
    position: "fixed"
  },
  toolbarMobile: {
    display: "flex",
    justifyContent: "space-around"
  },
  buttonMobile: {
    fontSize: "10px"
  },
  avatarMobile: {
    width: 30,
    height: 30,
    borderRadius: "80%",
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  exploreIconMobile: {
    fontSize: "25px",
    color: theme.palette.secondary.dark
  }
});

export default withRoot(withStyles(styles)(NavBar));
