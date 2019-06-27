import React, { useState, useContext } from "react";
import axios from "axios";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import AddAPhotoIcon from "@material-ui/icons/AddAPhotoTwoTone";
import LandscapeIcon from "@material-ui/icons/LandscapeOutlined";
import ClearIcon from "@material-ui/icons/Clear";
import SaveIcon from "@material-ui/icons/SaveTwoTone";
import { unstable_useMediaQuery as useMediaQuery } from "@material-ui/core/useMediaQuery";

import Context from "../../context";
import withRoot from "../../withRoot";
import Loading from "../pages/Loading";

const CreateMemory = ({ classes }) => {
  const mobileSize = useMediaQuery("(max-width: 650px)");

  const { state, dispatch } = useContext(Context);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  // handle new pin submit
  const handleSubmit = async event => {
    setLoading(true);
    try {
      event.preventDefault();

      // wait for cloudify upload
      const url = await handleImageUpload();
      const { latitude, longitude } = state.draft;
      const newPin = {
        author: state.user.name,
        title,
        content,
        image: url,
        latitude: latitude.toString(),
        longitude: longitude.toString()
      };
      //wait for new pin to be created on DB
      const pinAdded = await axios.post("/pins/", newPin);

      // if new pin created, clear draft state and fetch all user pins
      if (pinAdded.statusText === "OK") {
        handleDeleteDraft();
        try {
          // get all memories
          const { data } = await axios.get("/pins/all");
          if (data) {
            // set all memories, including the new one, to local state
            dispatch({ type: "MEMORIES", payload: data });
            // set currentPin so that upon creation, new memory is rendered
            dispatch({ type: "SET_PIN", payload: pinAdded.data });
            // stop circular progress
            setLoading(false);
          }
        } catch (err) {
          console.log("error retrieving user memories", err);
          setLoading(false);
        }
      } else {
        console.log("error retrieving user memories");
        setLoading(false);
      }
    } catch (err) {
      console.log("error creating memory", err);
      setLoading(false);
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
      });
    // return image's cloudify url to be saved in DB
    return url;
  };

  // clear draft state after memory creation
  const handleDeleteDraft = () => {
    setTitle("");
    setImage("");
    setContent("");
    dispatch({ type: "DRAFT", payload: null });
  };

  // return circularprogress until loading is set to false
  if (loading) {
    return (
      <div
        style={{
          height: "calc(100vh - 64px)",
          width: "100%"
        }}
      >
        <Loading />
      </div>
    );
  }

  return (
    <form className={mobileSize ? classes.formMobile : classes.form}>
      <div
        className={
          mobileSize ? classes.titleContainerMobile : classes.titleContainer
        }
      >
        <Typography
          className={mobileSize ? classes.titleMobile : classes.title}
        >
          <LandscapeIcon
            className={mobileSize ? classes.iconLargeMobile : classes.iconLarge}
          />{" "}
          Create A Memory
        </Typography>
      </div>

      <div>
        <TextField
          className={mobileSize ? classes.titleInputMobile : classes.titleInput}
          name="title"
          label="Title"
          placeholder="Title for your memory"
          onChange={e => setTitle(e.target.value)}
        />

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
            style={{ color: image && "#a2d800" }}
            component="span"
            size="small"
          >
            <AddAPhotoIcon />
          </Button>
        </label>
      </div>
      <div className={classes.contentField}>
        <TextField
          name="content"
          label="Content"
          multiline
          rows={mobileSize ? "3" : "6"}
          margin="normal"
          fullWidth
          variant="outlined"
          onChange={e => setContent(e.target.value)}
        />
      </div>
      <div>
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={handleDeleteDraft}
        >
          <ClearIcon className={classes.leftIcon} />
          Discard
        </Button>
        <Button
          className={classes.button}
          variant="contained"
          color="secondary"
          type="submit"
          disabled={!title.trim() || !content.trim() || !image}
          onClick={handleSubmit}
        >
          Submit
          <SaveIcon className={classes.rightIcon} />
        </Button>
      </div>
    </form>
  );
};

const styles = theme => ({
  form: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    marginLeft: theme.spacing.unit * 2
  },
  titleContainer: {
    display: "flex",
    alignItems: "center",
    width: "100%"
  },
  title: {
    color: theme.palette.secondary.dark,
    fontFamily: "Roboto",
    fontWeight: 400,
    fontSize: "28px"
  },
  contentField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: "95%"
  },
  input: {
    display: "none"
  },
  iconLarge: {
    fontSize: 40,
    marginRight: theme.spacing.unit
  },
  leftIcon: {
    fontSize: 20,
    marginRight: theme.spacing.unit
  },
  rightIcon: {
    fontSize: 20,
    marginLeft: theme.spacing.unit
  },
  button: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit,
    marginLeft: 0
  },
  //////////// MOBILE ////////////////
  formMobile: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2
  },
  titleContainerMobile: {
    display: "flex",
    justifyContent: "flex-start",
    width: "88%"
  },
  titleMobile: {
    color: theme.palette.secondary.dark,
    fontFamily: "Roboto",
    fontWeight: 400,
    fontSize: "22px"
  },
  iconLargeMobile: {
    fontSize: 30,
    marginRight: theme.spacing.unit
  }
});

export default withRoot(withStyles(styles)(CreateMemory));
