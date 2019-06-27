import React, { useState, useContext } from "react";
import axios from "axios";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import AddAPhotoIcon from "@material-ui/icons/AddAPhotoTwoTone";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Avatar from "@material-ui/core/Avatar";
import { unstable_useMediaQuery as useMediaQuery } from "@material-ui/core/useMediaQuery";

import Context from "../../context";
import withRoot from "../../withRoot";
import AuthToken from "../../utils/AuthToken";
import Loading from "../pages/Loading";

const UpdateOrCreateProfile = ({ classes }) => {
  const mobileSize = useMediaQuery("(max-width: 650px)");

  const { state, dispatch } = useContext(Context);
  const { user, profile } = state;

  const [image, setImage] = useState("");
  const [location, setLocation] = useState("");
  const [school, setSchool] = useState("");
  const [profession, setProfession] = useState("");
  const [bio, setBio] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [errors, setErrors] = useState({});

  const [dialog, setDialog] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  // handle submission of updated/created profile
  const onSubmit = async event => {
    setLoading(true);
    event.preventDefault();

    // Get info to create or update profile
    const newProfile = {
      location,
      school,
      profession,
      bio,
      facebook,
      instagram
    };

    // if user uploads an image, get & attach it to the request body
    if (image) {
      const url = await handleImageUpload();
      newProfile.image = url;
    }

    // get the new user object if image uploaded & post the profile to DB
    try {
      const { data } = await axios.post("/profile", newProfile);
      if (data) {
        // update profile on state
        dispatch({ type: "PROFILE", payload: data });
        // clean update state so that profile is rendered
        dispatch({ type: "PROFILE_UPDATE", payload: false });
        setLoading(false);
      }
      if (image) {
        const { data } = await axios.get("/users/current");
        if (data) dispatch({ type: "SET_USER", payload: data });
      }
    } catch (err) {
      setErrors(err.data);
    }
  };

  // upload image to cloudinary
  const handleImageUpload = async () => {
    const data = new FormData();
    data.append("file", image);
    // upload_preset's value should match cluster name on Cloudify
    data.append("upload_preset", "memoryhub");
    data.append("cloud_name", "alican-cloud");
    let url;
    await fetch("https://api.cloudinary.com/v1_1/alican-cloud/image/upload", {
      method: "post",
      body: data
    })
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        url = data.url;
      })
      .catch(err => {
        console.log(err);
      });
    // return image's cloudify url to be saved in DB
    return url;
  };

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
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%"
        }}
      >
        <Loading />
      </div>
    );
  }

  return (
    <div className={mobileSize ? classes.rootMobile : classes.root}>
      <div className={classes.form}>
        <Typography className={classes.hi}>Hi, {state.user.name}</Typography>
        <Typography className={classes.info}>
          You can update your profile below
        </Typography>
        <div className={classes.grow}>
          <Typography className={classes.upload}>
            Change Your Avatar:
          </Typography>
          <input
            className={classes.input}
            accept="image/*"
            id="image"
            type="file"
            onChange={e => setImage(e.target.files[0])}
          />
          <label htmlFor="image">
            <Button
              className={classes.button}
              style={{ color: image && "green" }}
              component="span"
              size="small"
            >
              <Avatar
                alt={user.name}
                src={profile && profile.image ? profile.image : user.avatar}
                className={mobileSize ? classes.avatarMobile : classes.avatar}
              />
              <AddAPhotoIcon />
            </Button>
          </label>
        </div>
        <TextField
          onChange={event => setLocation(event.target.value)}
          helperText="Your city and country"
          className={classes.textfields}
          name="location"
          label="Location"
          variant="outlined"
          defaultValue={
            profile && profile.location ? `${profile.location}` : null
          }
        />
        <TextField
          onChange={event => setSchool(event.target.value)}
          helperText="Where did you go to school?"
          className={classes.textfields}
          name="school"
          label="School"
          variant="outlined"
          defaultValue={profile && profile.school ? `${profile.school}` : null}
        />
        <TextField
          onChange={event => setProfession(event.target.value)}
          helperText="What do you do?"
          className={classes.textfields}
          name="profession"
          label="Profession"
          variant="outlined"
          defaultValue={
            profile && profile.profession ? `${profile.profession}` : null
          }
        />
        <TextField
          onChange={event => setBio(event.target.value)}
          helperText="Tell people about your lovely self"
          className={classes.textfields}
          name="bio"
          label="Bio"
          variant="outlined"
          multiline={true}
          defaultValue={profile && profile.profession ? `${profile.bio}` : null}
        />
        <TextField
          onChange={event => setFacebook(event.target.value)}
          error={errors.facebook ? true : false}
          helperText={
            errors.facebook
              ? errors.facebook
              : "Share your Facebook account so that people can connect with you"
          }
          className={classes.textfields}
          name="facebook"
          label="Facebook"
          variant="outlined"
          defaultValue={
            profile && profile.facebook ? `${profile.facebook}` : null
          }
        />
        <TextField
          onChange={event => setInstagram(event.target.value)}
          error={errors.instagram ? true : false}
          helperText={
            errors.instagram
              ? errors.instagram
              : "Share your Instagram account so that people can connect with you"
          }
          className={classes.textfields}
          name="instagram"
          label="Instagram"
          variant="outlined"
          defaultValue={
            profile && profile.instagram ? `${profile.instagram}` : null
          }
        />
        <Button
          onClick={onSubmit}
          className={mobileSize ? classes.buttonMobile : classes.button}
          variant="contained"
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
      </div>

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
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    minWidth: 320,
    height: "calc(100vh - 64px)",
    maxHeight: "calc(100vh - 64px)",
    overflow: "scroll",
    backgroundColor: theme.palette.primary.dark
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "80%",
    marginLeft: "3%",
    marginRight: "3%",
    paddingBottom: "5%"
  },
  hi: {
    color: "#fff",
    fontFamily: "Oswald",
    fontSize: "35px",
    marginTop: "35px"
  },
  info: {
    color: "#fff",
    fontFamily: "Oswald",
    fontWeight: "light",
    fontSize: "18px",
    marginTop: "2%",
    marginBottom: "2%"
  },
  grow: {
    flexGrow: 1,
    display: "flex",
    alignItems: "center"
  },
  upload: {
    color: "#fff",
    fontFamily: "Oswald",
    fontWeight: "light",
    fontSize: "17px",
    marginRight: theme.spacing.unit * 4
  },
  input: {
    display: "none"
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: "80%",
    marginRight: theme.spacing.unit * 5
  },
  textfields: {
    marginTop: "3%",
    width: "100%"
  },
  button: {
    marginTop: "6%",
    fontFamily: "Oswald",
    fontWeight: "bold",
    fontSize: "15px",
    color: "#fff"
  },
  /////// MOBILE //////////
  rootMobile: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    minWidth: 275,
    minHeight: "90vh",
    backgroundColor: theme.palette.primary.dark,
    marginTop: "55px"
  },
  buttonMobile: {
    marginTop: "6%",
    fontFamily: "Oswald",
    fontWeight: "bold",
    fontSize: "13px",
    color: "#fff"
  },
  avatarMobile: {
    width: 30,
    height: 30,
    borderRadius: "80%",
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  }
});

export default withRoot(withStyles(styles)(UpdateOrCreateProfile));
