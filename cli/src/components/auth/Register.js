import React, { useState, useContext } from "react";
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

const Register = ({ classes }) => {
  const mobileSize = useMediaQuery("(max-width: 650px)");

  const { dispatch } = useContext(Context);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [errors, setErrors] = useState({});
  const [checked, setCheckbox] = useState(false);

  const onSubmit = async () => {
    const newUser = { name, email, password, password2 };

    try {
      // register user
      const response = await axios.post("/users/register", newUser);
      if (response.data) {
        // if registered successfully, log in user
        const user = { email, password };
        try {
          const res = await axios.post("/users/login", user);
          // when successfully logged in, set token to localStorage and future request headers
          if (res.data.success) {
            const { token } = res.data;
            await localStorage.setItem("jwt_token", token);
            await AuthToken(token);
            const decoded = jwt_decode(token);
            dispatch({ type: "AUTH", payload: true });
            dispatch({ type: "SET_USER", payload: decoded });
            // clear signup state
            dispatch({ type: "SIGNUP_CLICK" });
          } else {
            const err = {
              err: "There has been a problem with logging in"
            };
            setErrors(err);
          }
        } catch (err) {
          setErrors(err.response.data);
        }
      } else {
        const err = {
          err: "There has been a problem with registering"
        };
        setErrors(err);
      }
    } catch (err) {
      setErrors(err.response.data);
    }
  };

  return (
    <div className={mobileSize ? classes.rootMobile : classes.root}>
      <p className={classes.signup}>Sign up</p>
      <div className={classes.form}>
        <TextField
          onChange={event => setName(event.target.value)}
          error={errors.name ? true : false}
          helperText={errors.name ? errors.name : null}
          className={classes.textfields}
          name="name"
          label="Username"
          variant="outlined"
          required={true}
        />
        <TextField
          onChange={event => setEmail(event.target.value)}
          error={errors.email ? true : false}
          helperText={errors.email ? errors.email : null}
          className={classes.textfields}
          name="email"
          label="Email"
          variant="outlined"
          required={true}
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
        />
        <TextField
          onChange={event => setPassword2(event.target.value)}
          error={errors.password2 ? true : false}
          helperText={errors.password ? errors.password : null}
          className={classes.textfields}
          name="password2"
          label="Confirm Pasword"
          variant="outlined"
          type={checked ? "text" : "password"}
          required={true}
        />
        <div className={classes.checkbox}>
          <Checkbox checked={checked} onChange={() => setCheckbox(!checked)} />
          <p className={classes.text}>Show Passwords</p>
        </div>
        <Button
          onClick={onSubmit}
          className={classes.button}
          variant="contained"
          color="secondary"
          type="submit"
        >
          Register
        </Button>
      </div>
      <p className={classes.text}>
        Already have an account? <br />
        <Button
          className={classes.loginButton}
          variant="text"
          mini={true}
          size="small"
          color="primary"
          type="submit"
          onClick={() => dispatch({ type: "SIGNUP_CLICK" })}
        >
          Login here
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
  signup: {
    color: "#fff",
    fontFamily: "Roboto",
    fontWeight: 400,
    fontSize: "23px",
    marginTop: "35px"
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
    fontSize: "17px",
    color: "#fff"
  },
  text: {
    color: "#fff",
    fontFamily: "Roboto",
    fontWeight: 300,
    fontSize: "15px",
    textAlign: "center"
  },
  loginButton: {
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
  }
});

export default withRoot(withStyles(styles)(Register));
