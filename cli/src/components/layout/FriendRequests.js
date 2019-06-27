import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Badge from "@material-ui/core/Badge";
import Menu from "@material-ui/core/Menu";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import { unstable_useMediaQuery as useMediaQuery } from "@material-ui/core/useMediaQuery";

import Context from "../../context";
import withRoot from "../../withRoot";

const FriendRequests = ({ classes }) => {
  const mobileSize = useMediaQuery("(max-width: 650px)");

  const { dispatch } = useContext(Context);

  const [requests, setRequests] = useState([]);
  const [menu, setMenu] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  // get user's friend requests
  useEffect(() => {
    const getRequests = async () => {
      const { data } = await axios.get("/profile/friends/requests");
      if (data) setRequests(data);
    };
    getRequests();
    return function() {
      setRequests([]);
    };
  }, []);

  // on friend request click, open the menu and position the items
  const onRequestsClick = event => {
    event.preventDefault();
    setMenu(true);
    setAnchorEl(event.currentTarget);
  };

  // on friend requests close, close the menu and set menu position to null
  const onRequestsClose = () => {
    setMenu(false);
    setAnchorEl(null);
  };

  // on accept click, add the friend and set requests on local state
  const onAccept = async name => {
    try {
      const res = await axios.post("/profile/friends", { name });
      res.statusText === "OK"
        ? setRequests(res.data.friendRequests)
        : setRequests([]);
    } catch (err) {
      setRequests([]);
    }
  };

  // on decline click, clean up requests on both server and local state
  const onDecline = async name => {
    try {
      const res = await axios.delete(
        `/profile/friends/requests/decline/${name}`
      );
      res.statusText === "OK"
        ? setRequests(res.data.friendRequests)
        : setRequests([]);
    } catch (err) {
      setRequests([]);
    }
  };

  return (
    <div>
      <Badge
        color="secondary"
        badgeContent={!requests.length > 0 ? null : requests.length}
        className={mobileSize ? classes.badgeMobile : classes.badge}
      >
        <Button
          onClick={event => onRequestsClick(event)}
          className={mobileSize ? classes.buttonMobile : classes.button}
          color="secondary"
        >
          Requests
        </Button>
      </Badge>

      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        open={menu}
        onClose={onRequestsClose}
        className={classes.menu}
      >
        <List className={classes.list}>
          <Typography className={classes.title}>
            Friend Requests {`(${requests.length})`}
          </Typography>
          <Typography className={classes.noRequests}>
            {requests.length < 1
              ? "You currently have no friend requests"
              : null}
          </Typography>

          {requests.map((request, index) => (
            <ListItem key={index} className={classes.item}>
              <ListItemAvatar>
                <Avatar alt={`${request.name}'s avatar`} src={request.avatar} />
              </ListItemAvatar>

              <div className={classes.container}>
                <Link
                  to="/friend"
                  className={classes.link}
                  onClick={() =>
                    dispatch({ type: "SET_PIN_AUTHOR", payload: request })
                  }
                >
                  <Typography className={classes.name}>
                    {request.name}
                  </Typography>
                </Link>

                <div>
                  <Button
                    onClick={() => onAccept(request.name)}
                    size="small"
                    variant="outlined"
                    color="secondary"
                    style={{ fontWeight: 300 }}
                  >
                    Accept
                  </Button>
                  <Button
                    onClick={() => onDecline(request.name)}
                    size="small"
                    variant="contained"
                    color="primary"
                    style={{ marginLeft: "5px", fontWeight: 300 }}
                  >
                    Decline
                  </Button>
                </div>
              </div>
            </ListItem>
          ))}
        </List>
      </Menu>
    </div>
  );
};

const styles = theme => ({
  badge: {
    marginRight: theme.spacing.unit * 5
  },
  button: {
    textDecoration: "none",
    color: "#dcdcdc",
    fontFamily: "Roboto",
    fontWeight: 400
  },
  list: {
    width: "100%",
    minWidth: 300,
    textAlign: "center",
    padding: "5%"
  },
  title: {
    color: "#fff",
    marginTop: theme.spacing.unit,
    fontFamily: "Roboto",
    fontWeight: 500,
    fontSize: "17px"
  },
  noRequests: {
    color: "#f5f5f5",
    marginTop: theme.spacing.unit * 2,
    fontFamily: "Roboto",
    fontWeight: 300,
    fontSize: "14px"
  },
  item: {
    marginTop: theme.spacing.unit,
    backgroundColor: theme.palette.primary.main,
    borderRadius: "3px"
  },
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    marginLeft: "7%"
  },
  name: {
    color: "#cdcdcd",
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
    fontFamily: "Roboto",
    fontWeight: 300,
    fontSize: "17px"
  },
  link: {
    textDecoration: "none"
  },
  //////////////// MOBILE /////////////////////////
  badgeMobile: {
    marginRight: theme.spacing.unit
  },
  buttonMobile: {
    textDecoration: "none",
    color: "#dcdcdc",
    fontSize: "10px",
    fontFamily: "Roboto",
    fontWeight: 400
  }
});

export default withRoot(withStyles(styles)(FriendRequests));
