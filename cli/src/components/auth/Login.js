import React, { useContext } from "react";
import { withStyles } from "@material-ui/core/styles";
import { unstable_useMediaQuery as useMediaQuery } from "@material-ui/core/useMediaQuery";

import icon from "../../images/favicon.png";
import gif from "../../images/mapGift.gif";

import Context from "../../context";
import withRoot from "../../withRoot";
import UserLogin from "./UserLogin";
import Register from "./Register";

const Login = ({ classes }) => {
  const mobileSize = useMediaQuery("(max-width: 650px)");
  const { state } = useContext(Context);

  let formContent = state.signup ? <Register /> : <UserLogin />;

  return (
    <div className={mobileSize ? classes.rootMobile : classes.root}>
      <div
        className={
          mobileSize ? classes.logoAndTitleMobile : classes.logoAndTitle
        }
      >
        <div
          className={
            mobileSize ? classes.welcomefieldMobile : classes.welcomefield
          }
        >
          <img
            src={icon}
            alt="logo"
            className={mobileSize ? classes.imageMobile : classes.image}
          />
          <p className={mobileSize ? classes.titleMobile : classes.title}>
            Memory Hub
          </p>
        </div>
        <div
          className={
            mobileSize
              ? classes.subtitleContainerMobile
              : classes.subtitleContainer
          }
        >
          <p className={mobileSize ? classes.subtitleMobile : classes.subtitle}>
            Memory Hub is the meeting place for people who would like to share
            their memories with the rest of the world.
            <br />
            <br />
            Pin a location, save your photo and memory, and share your precious
            moment with the rest of the world on our real-time map.
          </p>
        </div>
      </div>

      {formContent}
    </div>
  );
};

const styles = theme => ({
  root: {
    display: "flex",
    width: "100%",
    height: "100vh"
  },
  logoAndTitle: {
    display: "flex",
    flexDirection: "column",
    width: "70%",
    backgroundImage: `url(${gif})`,
    opacity: 0.8
  },
  welcomefield: {
    display: "flex",
    marginTop: "5%",
    marginLeft: "5%",
    opacity: 1.5
  },
  image: {
    width: "150px",
    height: "150px"
  },
  title: {
    color: "#fff",
    fontSize: "65px",
    fontFamily: "Fredericka the Great",
    marginLeft: "10%",
    marginRight: "4%"
  },
  subtitleContainer: {
    marginLeft: "10%",
    marginRight: "10%",
    textAlign: "center"
  },
  subtitle: {
    color: "#fff",
    fontFamily: "Oswald",
    fontWeight: 800,
    fontSize: "25px"
  },
  // //////// MOBILE //////// //
  logoAndTitleMobile: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    height: "60vh",
    backgroundImage: `url(${gif})`,
    opacity: 0.8
  },
  welcomefieldMobile: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "5%",
    opacity: 1.5
  },
  imageMobile: {
    width: "100px",
    height: "100px"
  },
  titleMobile: {
    color: "#fff",
    fontSize: "40px",
    fontFamily: "Fredericka the Great"
  },
  subtitleContainerMobile: {
    marginLeft: "10%",
    marginRight: "10%"
  },
  subtitleMobile: {
    color: "#fff",
    fontFamily: "Roboto",
    textAlign: "center",
    fontWeight: 400,
    fontSize: "16px"
  }
});

export default withRoot(withStyles(styles)(Login));
