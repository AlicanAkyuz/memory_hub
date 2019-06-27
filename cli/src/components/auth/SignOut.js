import React, { useContext } from "react";
import { withStyles } from "@material-ui/core/styles";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Typography from "@material-ui/core/Typography";
import { unstable_useMediaQuery as useMediaQuery } from "@material-ui/core/useMediaQuery";

import Context from "../../context";
import withRoot from "../../withRoot";
import AuthToken from "../../utils/AuthToken";

const SignOut = ({ classes }) => {
  const mobileSize = useMediaQuery("(max-width: 650px)");

  const { dispatch } = useContext(Context);

  const onClick = () => {
    localStorage.removeItem("jwt_token");
    AuthToken(false);
    dispatch({ type: "SET_USER", payload: {} });
  };

  return (
    <span className={classes.root} onClick={onClick}>
      <Typography
        style={{ display: mobileSize ? "none" : "block" }}
        variant="body1"
        className={classes.buttonText}
      >
        SIGN OUT
      </Typography>
      <ExitToAppIcon
        className={mobileSize ? classes.buttonIconMobile : classes.buttonIcon}
      />
    </span>
  );
};

const styles = theme => ({
  root: {
    cursor: "pointer",
    display: "flex"
  },
  buttonText: {
    fontFamily: "Roboto",
    fontWeight: 400,
    fontSize: "15px",
    color: "#dcdcdc",
    marginTop: "2px"
  },
  buttonIcon: {
    marginLeft: "3px",
    color: "#dcdcdc"
  },
  ////////// MOBILE //////////////
  buttonIconMobile: {
    width: "20px",
    height: "20px",
    marginLeft: "3px",
    color: "#dcdcdc"
  }
});

export default withRoot(withStyles(styles)(SignOut));
