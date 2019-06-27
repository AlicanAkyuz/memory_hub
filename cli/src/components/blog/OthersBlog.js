import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import { distanceInWordsToNow } from "date-fns";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import AccessTime from "@material-ui/icons/AccessTime";
import Chip from "@material-ui/core/Chip";
import TagFacesIcon from "@material-ui/icons/TagFaces";
import ClearIcon from "@material-ui/icons/Clear";

import Context from "../../context";
import withRoot from "../../withRoot";
import Comments from "../comment/Comments";
import CreateComment from "../comment/CreateComment";

const MemoryContent = ({ classes }) => {
  const { state, dispatch } = useContext(Context);
  const { _id, title, image, content, author, date } = state.currentPin;

  const [added, setAdded] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const [errors, setErrors] = useState(false);

  useEffect(() => {
    const getAuthorsRequests = async () => {
      try {
        // check if the author (of the pin) is already added as a friend by the user

        // pull author's requests
        const { data } = await axios.get(`/profile/friends/requests/${author}`);

        // check if author's requests includes the current user
        const isAdded = data.find(request => request.name === state.user.name);

        // if so, update 'added' state
        if (isAdded !== undefined) setAdded(true);

        // check if the author (of the pin) already is a friend of the current user
        // pull the current user's friends
        const res = await axios.get("/profile/friends/all");

        if (res.data) {
          // check if user's friends include the author of the pin
          const isFriend = res.data.find(friend => friend.name === author);
          if (isFriend !== undefined) setIsFriend(true);
        } else {
          setErrors(true);
        }
      } catch (err) {
        setErrors(true);
      }
    };
    getAuthorsRequests();
  }, []);

  // handle click on addFriend/cancel friend
  const onAddOrCancelClick = async () => {
    // post the user to the author (of the pin)'s requests if not already there
    if (!added) {
      try {
        const body = { name: author };
        const res = await axios.post("/profile/friends/requests", body);
        if (res.statusText === "OK") {
          setAdded(!added);
        } else {
          setErrors(true);
        }
      } catch (err) {
        setErrors(true);
      }
    } else {
      // delete user from author's requests
      try {
        const { statusText } = await axios.delete(
          `/profile/friends/requests/${author}`
        );
        if (statusText === "OK") setAdded(false);
      } catch (err) {
        setErrors(true);
      }
    }
  };

  // handle unfriend request
  const onUnfriendClick = async () => {
    try {
      const res = await axios.delete(`/profile/friends/${author}`);
      if (res.statusText === "OK") {
        setIsFriend(false);
        setAdded(false);
      } else {
        setErrors(true);
      }
    } catch (err) {
      setErrors(true);
    }
  };

  // render 'add friend' chip if not already added or friends
  let addFriendContent = (
    <Chip
      icon={<TagFacesIcon />}
      label={`Add ${author} as a friend!`}
      clickable
      className={classes.chip}
      color="secondary"
      onClick={onAddOrCancelClick}
    />
  );

  // render 'cancel request' chip if already added
  if (added) {
    addFriendContent = (
      <Chip
        icon={<ClearIcon />}
        label="Cancel friend request"
        clickable
        className={classes.chip}
        color="primary"
        onClick={onAddOrCancelClick}
      />
    );
  }

  // render 'unfriend' chip already friends
  if (isFriend) {
    addFriendContent = (
      <Chip
        icon={<ClearIcon />}
        label={`Unfriend ${author}`}
        clickable
        className={classes.chip}
        color="primary"
        onClick={onUnfriendClick}
      />
    );
  }

  if (errors)
    return (
      <div className={classes.root}>
        <Typography className={classes.title} gutterBottom>
          There has been a problem! Please try again.
        </Typography>
      </div>
    );

  return (
    <div className={classes.root}>
      <div className={classes.titleContainer}>
        <Typography className={classes.title}>{title}</Typography>
        <Link
          to="/friend"
          className={classes.link}
          onClick={() => dispatch({ type: "SET_PIN", payload: null })}
        >
          by&nbsp;<h2 className={classes.author}>{author}</h2>
          <img
            src={state.currentAuthor.avatar}
            alt="user avatar"
            className={classes.userAvatar}
          />
        </Link>
        {addFriendContent}
      </div>

      <div className={classes.imageContainer}>
        <img src={image} alt="user memory" className={classes.userMemory} />
      </div>

      <Typography className={classes.content} gutterBottom>
        {content}
      </Typography>

      <Typography className={classes.date} gutterBottom>
        <AccessTime className={classes.icon} />
        Created {distanceInWordsToNow(date)} ago
      </Typography>

      {/* Memory Comments */}
      <Comments pinId={_id} />
      <CreateComment />
    </div>
  );
};

const styles = theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    minWidth: 320
  },
  titleContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    textAlign: "center",
    width: "100%",
    padding: "5%",
    backgroundColor: theme.palette.primary.main,
    borderBottom: "1px solid #fff"
  },
  title: {
    color: "#F5F5F5",
    fontFamily: "Roboto",
    fontWeight: 400,
    fontSize: "30px"
  },
  imageContainer: {
    display: "flex",
    width: "100%",
    justifyContent: "center",
    marginTop: "3%"
  },
  userMemory: {
    width: "200px",
    height: "200px",
    borderRadius: "5%"
  },
  content: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontFamily: "Roboto",
    fontSize: "15px",
    fontWeight: 300,
    margin: theme.spacing.unit * 2
  },
  date: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.palette.secondary.light,
    fontFamily: "Roboto",
    fontWeight: 300,
    fontSize: "13px",
    marginBottom: theme.spacing.unit
  },
  userAvatar: {
    width: "30px",
    height: "30px",
    borderRadius: "80%",
    marginLeft: 4
  },
  icon: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  author: {
    fontWeight: 400,
    fontSize: "15px"
  },
  link: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
    color: theme.palette.secondary.dark,
    fontFamily: "Roboto",
    fontWeight: 400,
    fontSize: "15px"
  },
  chip: {
    margin: theme.spacing.unit
  }
});

export default withRoot(withStyles(styles)(MemoryContent));
