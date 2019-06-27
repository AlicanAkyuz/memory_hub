import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { distanceInWordsToNow } from "date-fns";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";

import Context from "../../context";
import Loading from "../pages/Loading";

const Comments = ({ pinId, classes }) => {
  const { state, dispatch } = useContext(Context);
  const [loading, setLoading] = useState(true);

  // get memory's comments upon mounting
  useEffect(() => {
    const getMemoryComments = async () => {
      try {
        const { data } = await axios.get(`/pins/${pinId}`);
        dispatch({ type: "COMMENTS", payload: data.comments });
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    };
    getMemoryComments();
    // clear comments state upon dismounting
    return function() {
      dispatch({ type: "COMMENTS", payload: [] });
    };
  }, []);

  // return circularprogress until loading is set to false
  if (loading) {
    return (
      <div style={{ height: "50vh" }}>
        <Loading />
      </div>
    );
  }

  return (
    <List className={classes.root}>
      <div className={classes.titleContainer}>
        <Typography className={classes.title}>
          Comments {`(${state.comments.length})`}
        </Typography>
      </div>

      <div className={classes.titleContainer}>
        <Typography className={classes.noComment}>
          {state.comments.length < 1
            ? "This memory has no comments yet :/"
            : null}
        </Typography>
      </div>

      {state.comments.map((comment, index) => (
        <ListItem key={index} alignItems="flex-start">
          <ListItemAvatar>
            <Avatar src={comment.avatar} alt={comment.name} />
          </ListItemAvatar>
          <ListItemText
            primary={
              <>
                <Typography className={classes.text}>{comment.text}</Typography>
                <Typography
                  className={classes.inline}
                  component="span"
                  color="secondary"
                >
                  By {comment.name} — {distanceInWordsToNow(comment.date)} ago
                </Typography>
              </>
            }
          />
        </ListItem>
      ))}
    </List>
  );
};

const styles = theme => ({
  root: {
    width: "100%",
    minWidth: 320
  },
  titleContainer: {
    width: "100%",
    textAlign: "center"
  },
  title: {
    color: theme.palette.secondary.main,
    backgroundColor: theme.palette.primary.dark,
    marginTop: theme.spacing.unit * 2,
    fontFamily: "Roboto",
    fontWeight: 300,
    fontSize: "17px"
  },
  noComment: {
    color: theme.palette.primary.light,
    marginTop: theme.spacing.unit * 2,
    fontFamily: "Roboto",
    fontWeight: 300,
    fontSize: "14px"
  },
  text: {
    color: "#fff",
    fontFamily: "Roboto",
    fontWeight: 300,
    fontSize: "13px"
  },
  inline: {
    display: "inline",
    fontFamily: "Roboto",
    fontWeight: 300,
    fontSize: "11px"
  }
});

export default withStyles(styles)(Comments);
