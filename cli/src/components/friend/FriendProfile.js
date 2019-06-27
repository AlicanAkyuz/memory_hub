import React, { useState, useEffect, useContext } from "react";
import axios from "axios";

import { withStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import Chip from "@material-ui/core/Chip";
import TagFacesIcon from "@material-ui/icons/TagFaces";
import ClearIcon from "@material-ui/icons/Clear";

import Context from "../../context";
import withRoot from "../../withRoot";

const FriendProfile = ({ classes }) => {
  const { state } = useContext(Context);
  const { currentAuthor, friendProfile, user } = state;

  const [areFriends, setAreFriends] = useState(false);
  const [isOwnerAddedByUser, setIsOwnerAddedByUser] = useState(false);
  const [isUserAddedByOwner, setIsUserAddedByOwner] = useState(false);

  const [errors, setErrors] = useState(false);

  // determine the relationship between the user and the page owner
  useEffect(() => {
    // check if they are already friends
    const alreadyFriends = friendProfile.friends.find(
      fr => fr.name === user.name
    );
    if (alreadyFriends !== undefined) setAreFriends(true);

    // check if page owner is already added by the user
    const alreadyAdded = friendProfile.friendRequests.find(
      rq => rq.name === user.name
    );
    if (alreadyAdded !== undefined) setIsOwnerAddedByUser(true);

    // check if user is added by page owner
    const getUserProfile = async () => {
      try {
        const { data, statusText } = await axios.get("/profile");
        if (statusText === "OK") {
          const isAdded = data.friendRequests.find(
            rq => rq.name === currentAuthor.name
          );
          if (isAdded !== undefined) setIsUserAddedByOwner(true);
        }
      } catch (err) {
        setErrors(true);
      }
    };

    getUserProfile();
  }, []);

  // handle click on addFriend / cancel friend
  const onAddOrCancelClick = async () => {
    if (!isOwnerAddedByUser) {
      // post the user to the page owner's requests
      try {
        const body = { name: currentAuthor.name };
        const res = await axios.post("/profile/friends/requests", body);
        if (res.statusText === "OK") setIsOwnerAddedByUser(true);
      } catch (err) {
        setErrors(true);
      }
    } else {
      // delete user from page owner's requests
      try {
        const { statusText } = await axios.delete(
          `/profile/friends/requests/${currentAuthor.name}`
        );
        if (statusText === "OK") setIsOwnerAddedByUser(false);
      } catch (err) {
        setErrors(true);
      }
    }
  };

  // handle unfriend request
  const onUnfriendClick = async () => {
    try {
      const { statusText } = await axios.delete(
        `/profile/friends/${currentAuthor.name}`
      );

      if (statusText === "OK") {
        setAreFriends(false);
        setIsOwnerAddedByUser(false);
      }
    } catch (err) {
      console.log("catch has run");
      setErrors(true);
    }
  };

  // on accept friend request of the page owner by the user
  const onAcceptFriend = async () => {
    try {
      const { statusText } = await axios.post("/profile/friends", {
        name: currentAuthor.name
      });
      if (statusText === "OK") setAreFriends(true);
    } catch (err) {
      setErrors(true);
    }
  };

  // default 'add friend' chip if not already friends and either added the other
  let friendStatus = (
    <Chip
      icon={<TagFacesIcon />}
      label={`Add ${currentAuthor.name} as a friend!`}
      clickable
      className={classes.chip}
      color="secondary"
      onClick={onAddOrCancelClick}
    />
  );

  // render 'cancel request' chip if page owner is added by the user
  if (isOwnerAddedByUser) {
    friendStatus = (
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

  // render 'accept request' chip if the user is added by the owner
  if (isUserAddedByOwner) {
    friendStatus = (
      <Chip
        icon={<TagFacesIcon />}
        label={`Accept ${currentAuthor.name}'s request`}
        clickable
        className={classes.chip}
        color="secondary"
        onClick={onAcceptFriend}
      />
    );
  }

  // render 'unfriend' chip already friends
  if (areFriends) {
    friendStatus = (
      <Chip
        icon={<ClearIcon />}
        label={`Unfriend ${currentAuthor.name}`}
        clickable
        className={classes.chip}
        color="primary"
        onClick={onUnfriendClick}
      />
    );
  }

  // handle errors
  if (errors) {
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
        <h1 className={classes.name}>
          There has been a server problem, please try again.
        </h1>
      </div>
    );
  }

  return (
    <div className={classes.container}>
      <Card className={classes.card}>
        <Avatar
          alt={currentAuthor.name}
          src={currentAuthor.avatar}
          className={classes.bigAvatar}
        />
        <CardContent className={classes.content}>
          <Typography variant="h5" component="h2" className={classes.name}>
            {currentAuthor.name}
          </Typography>
          {friendStatus}
          <Typography className={classes.title} color="textSecondary">
            Location:{" "}
            {friendProfile.location ? friendProfile.location : "Unknown"}
          </Typography>
          <Typography className={classes.title} color="textSecondary">
            Profession:{" "}
            {friendProfile.profession ? friendProfile.profession : "Unknown"}
          </Typography>
          <Typography className={classes.title} color="textSecondary">
            School: {friendProfile.school ? friendProfile.school : "Unknwon"}
          </Typography>
          <Typography component="p" className={classes.bio}>
            About {currentAuthor.name}
          </Typography>
          <Typography className={classes.title} color="textSecondary">
            {friendProfile.bio ? friendProfile.bio : "Unknown"}
          </Typography>
          <Typography component="p" className={classes.bio}>
            {`Friends (${
              friendProfile.friends.length ? friendProfile.friends.length : "0"
            })`}
          </Typography>
          <div className={classes.friendHolder}>
            {friendProfile.friends.map((friend, index) => (
              <div style={{ marginTop: 5 }} key={index}>
                <Tooltip title={friend.name} placement="top">
                  <img
                    alt={friend.name}
                    src={friend.avatar}
                    className={classes.friendAvatar}
                  />
                </Tooltip>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
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
    minWidth: 275,
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
  chip: {
    margin: theme.spacing.unit
  }
});

export default withRoot(withStyles(styles)(FriendProfile));
