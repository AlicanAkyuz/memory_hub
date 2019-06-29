import React, { useContext, useState } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";

import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import { unstable_useMediaQuery as useMediaQuery } from "@material-ui/core/useMediaQuery";

import gif from "../../images/mapGift.gif";

import Context from "../../context";
import withRoot from "../../withRoot";
import AuthToken from "../../utils/AuthToken";

const UserLogin = ({ classes }) => {
  const mobileSize = useMediaQuery("(max-width: 650px)");

  const { dispatch } = useContext(Context);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [checked, setCheckbox] = useState(false);

  const onClick = async () => {
    const user = { email, password };
    // log in user
    try {
      const response = await axios.post("/users/login", user);
      // when successfully logged in, set token to localStorage and future request headers
      if (response.data.success) {
        const { token } = response.data;
        await localStorage.setItem("jwt_token", token);
        AuthToken(token);
        const decoded = jwt_decode(token);
        dispatch({ type: "AUTH", payload: true });
        dispatch({ type: "SET_USER", payload: decoded });
      } else {
        const err = {
          err: "There has been a problem with logging in"
        };
        setErrors(err);
      }
    } catch (err) {
      setErrors(err.response.data);
    }
  };

  return (
    <div className={mobileSize ? classes.rootMobile : classes.root}>
      <p className={mobileSize ? classes.loginMobile : classes.login}>Login</p>
      <div className={classes.form}>
        <TextField
          onChange={event => setEmail(event.target.value)}
          className={classes.textfields}
          error={errors.email ? true : false}
          helperText={errors.email ? errors.email : null}
          name="email"
          label="Email"
          variant="outlined"
          required={true}
          value={email}
        />
        <TextField
          onChange={event => setPassword(event.target.value)}
          error={errors.password ? true : false}
          helperText={errors.password ? errors.password : null}
          className={classes.textfields}
          name="password"
          label="Password"
          variant="outlined"
          type={checked ? "text" : "password"}
          required={true}
          value={password}
        />
        <div className={classes.checkbox}>
          <Checkbox checked={checked} onChange={() => setCheckbox(!checked)} />
          <p className={classes.text}>Show Password</p>
        </div>

        <Button
          className={classes.button}
          variant="contained"
          color="secondary"
          type="submit"
          onClick={onClick}
        >
          Jump In
        </Button>
      </div>

      <p className={classes.text}>
        If you don't already have an account <br />
        <Button
          className={classes.signupButton}
          variant="text"
          mini={true}
          size="small"
          color="primary"
          type="submit"
          onClick={() => dispatch({ type: "SIGNUP_CLICK" })}
        >
          Sign up here
        </Button>
      </p>
    </div>
  );
};

const styles = theme => ({
  root: {
    display: "flex",
    width: "30%",
    flexDirection: "column",
    alignItems: "center",
    borderLeft: `1px solid ${theme.palette.primary.light}`,
    backgroundColor: theme.palette.primary.main
  },
  login: {
    color: "#fff",
    fontFamily: "Roboto",
    fontWeight: 400,
    fontSize: "23px",
    marginTop: "100px"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "90%",
    paddingBottom: theme.spacing.unit
  },
  textfields: {
    marginTop: "5%",
    width: "100%"
  },
  checkbox: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start"
  },
  button: {
    width: "120px",
    marginTop: "6%",
    fontFamily: "Roboto",
    fontWeight: 400,
    fontSize: "16px",
    color: "#f5f5f5"
  },
  text: {
    color: "#fff",
    fontFamily: "Roboto",
    fontWeight: 300,
    fontSize: "13px",
    textAlign: "center"
  },
  signupButton: {
    width: "100%",
    fontFamily: "Roboto",
    fontWeight: 500,
    fontSize: "17px",
    color: "#fff"
  },
  ///////////////// MOBILE ///////////////////////
  rootMobile: {
    display: "flex",
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: theme.palette.primary.main,
    backgroundImage: `url(${gif})`
  },
  loginMobile: {
    color: "#fff",
    fontFamily: "Roboto",
    fontWeight: 400,
    fontSize: "25px"
  }
});

export default withRoot(withStyles(styles)(UserLogin));
