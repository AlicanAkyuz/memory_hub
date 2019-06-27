import React, { useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Tooltip from "@material-ui/core/Tooltip";
import { unstable_useMediaQuery as useMediaQuery } from "@material-ui/core/useMediaQuery";

import Context from "../../context";
import withRoot from "../../withRoot";
import AuthToken from "../../utils/AuthToken";
import Loading from "../pages/Loading";

const UserProfile = ({ classes }) => {
  const mobileSize = useMediaQuery("(max-width: 650px)");

  const { state, dispatch } = useContext(Context);
  const { user, profile } = state;
  const [dialog, setDialog] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  // delete user profile and account
  const deleteProfile = async () => {
    setLoading(true);
    try {
      const data = await axios.delete("/profile");
      // clear local storage, auth header, and the state
      if (data) {
        setDialog(false);
        localStorage.removeItem("jwt_token");
        AuthToken(false);
        dispatch({ type: "SET_USER", payload: {} });
        setLoading(false);
      }
    } catch (err) {
      setError(true);
    }
  };

  // return circularprogress until loading is set to false
  if (loading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <div className={mobileSize ? classes.containerMobile : classes.container}>
      <Card className={classes.card}>
        <Avatar
          alt={user.name}
          src={profile && profile.image ? profile.image : user.avatar}
          className={classes.bigAvatar}
        />
        <CardContent className={classes.content}>
          <Typography variant="h5" component="h2" className={classes.name}>
            {user.name}
          </Typography>
          <Typography className={classes.title} color="textSecondary">
            Location:{" "}
            {profile && profile.location ? profile.location : "Unknown"}
          </Typography>
          <Typography className={classes.title} color="textSecondary">
            Profession:{" "}
            {profile && profile.profession ? profile.profession : "Unknown"}
          </Typography>
          <Typography className={classes.title} color="textSecondary">
            School: {profile && profile.school ? profile.school : "Unknown"}
          </Typography>
          <Typography component="p" className={classes.bio}>
            About {user.name}
          </Typography>
          <Typography className={classes.title} color="textSecondary">
            {profile && profile.bio ? profile.bio : "Unknown"}
          </Typography>
          <Typography component="p" className={classes.bio}>
            {`Friends (${profile ? profile.friends.length : "0"})`}
          </Typography>
          <div className={classes.friendHolder}>
            {profile
              ? profile.friends.map((friend, index) => (
                  <div style={{ marginTop: 5 }} key={index}>
                    <Tooltip title={friend.name} placement="top">
                      <Link to="/friend">
                        <img
                          onClick={() =>
                            dispatch({
                              type: "SET_PIN_AUTHOR",
                              payload: friend
                            })
                          }
                          alt={friend.name}
                          src={friend.avatar}
                          className={classes.friendAvatar}
                        />
                      </Link>
                    </Tooltip>
                  </div>
                ))
              : null}
          </div>
        </CardContent>
        <CardActions>
          <Button
            onClick={() => dispatch({ type: "PROFILE_UPDATE", payload: true })}
            className={mobileSize ? classes.buttonMobile : classes.button}
            variant="outlined"
            color="secondary"
            type="submit"
          >
            Update Profile
          </Button>
          <Button
            onClick={() => setDialog(true)}
            className={mobileSize ? classes.buttonMobile : classes.button}
            variant="outlined"
            color="primary"
            type="submit"
          >
            Delete Account
          </Button>
        </CardActions>
      </Card>

      {/* Dialog section */}
      <Dialog open={dialog} onClose={() => setDialog(false)}>
        <DialogTitle>{"Are you sure?"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {error
              ? "There has been a problem with deleting your account. Please try again."
              : "We are sorry to see you go... Are you sure you want to delete your profile and account?"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={deleteProfile} color="primary">
            Yes
          </Button>
          <Button onClick={() => setDialog(false)} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const styles = theme => ({
  container: {
    display: "flex",
    width: "100%",
    minWidth: 320
  },
  card: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    minWidth: 320,
    height: "calc(100vh - 64px)",
    maxHeight: "calc(100vh - 64px)",
    overflow: "scroll",
    backgroundColor: theme.palette.primary.dark,
    paddingTop: "3%"
  },
  bigAvatar: {
    width: 130,
    height: 130
  },
  content: {
    width: "80%",
    textAlign: "center"
  },
  name: {
    fontFamily: "Oswald",
    fontSize: "55px",
    color: "#ffca28",
    marginBottom: 12
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)"
  },
  title: {
    color: "#F5F5F5",
    fontFamily: "Roboto",
    fontWeight: 300,
    fontSize: "15px",
    marginBottom: theme.spacing.unit
  },
  bio: {
    fontFamily: "Oswald",
    color: "#ff8f00",
    fontSize: 20,
    marginTop: 15
  },
  friendHolder: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center"
  },
  friendAvatar: {
    width: 50,
    height: 50
  },
  friendsTitle: {
    marginBottom: 7
  },
  button: {
    marginTop: "5%",
    fontFamily: "Roboto",
    fontWeight: 400,
    fontSize: "15px",
    color: "#f5f5f5"
  },
  ////////// MOBILE //////////
  containerMobile: {
    display: "flex",
    width: "100%",
    marginTop: "55px"
  },
  buttonMobile: {
    marginTop: "5%",
    fontFamily: "Roboto",
    fontWeight: 400,
    fontSize: "13px",
    color: "#f5f5f5"
  }
});

export default withRoot(withStyles(styles)(UserProfile));
