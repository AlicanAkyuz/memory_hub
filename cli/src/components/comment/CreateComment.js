import React, { useState, useContext } from "react";
import axios from "axios";
import { withStyles } from "@material-ui/core";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";
import SendIcon from "@material-ui/icons/Send";
import Divider from "@material-ui/core/Divider";

import Context from "../../context";
import Loading from "../pages/Loading";

const CreateComment = ({ classes }) => {
  const { dispatch, state } = useContext(Context);
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);

  // handle new comment submission
  const handleSubmitComment = async () => {
    setLoading(true);
    let data = {};

    // pull data from currentPin's state
    if (state.currentPin) {
      data.pin_id = state.currentPin._id;
      data.text = comment;
    } else if (state.discoverMemory) {
      data.pin_id = state.discoverMemory._id;
      data.text = comment;
    }

    try {
      // post the comment
      const { statusText } = await axios.post(`/pins/comments`, data);
      if (statusText === "OK") {
        // upon successful posting, get all comments and set comments state
        const { data } = await axios.get(`/pins/${state.currentPin._id}`);
        dispatch({ type: "COMMENTS", payload: data.comments });
        // clear loading screen and  local state
        setLoading(false);
        setComment("");
      }
    } catch (err) {
      if (err.response) {
        setErrors(err.response.data);
      }
      setLoading(false);
    }
  };

  // return an error message if fetch fails
  if (errors) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <p style={{ fontSize: "25px", color: "#dcdcdc" }}>
          There has been an error getting this memory's comments
        </p>
      </div>
    );
  }

  // return circularprogress until loading is set to false
  if (loading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <form className={classes.form}>
        <IconButton
          disabled={!comment.trim()}
          className={classes.clearButton}
          onClick={() => setComment("")}
        >
          <ClearIcon />
        </IconButton>
        <InputBase
          className={classes.input}
          multiline={true}
          placeholder="Add Comment"
          value={comment}
          onChange={event => setComment(event.target.value)}
        />
        <IconButton
          disabled={!comment.trim()}
          className={classes.sendButton}
          onClick={handleSubmitComment}
        >
          <SendIcon />
        </IconButton>
      </form>
      <Divider />
    </div>
  );
};

const styles = theme => ({
  root: {
    marginBottom: "5%",
    marginTop: "5%"
  },
  form: {
    display: "flex",
    alignItems: "center"
  },
  input: {
    marginLeft: 8,
    flex: 1
  },
  clearButton: {
    padding: 0,
    color: "red"
  },
  sendButton: {
    padding: 0,
    color: theme.palette.secondary.dark
  }
});

export default withStyles(styles)(CreateComment);
