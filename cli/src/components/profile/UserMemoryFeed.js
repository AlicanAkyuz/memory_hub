import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { distanceInWordsToNow } from "date-fns";
import { withStyles } from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import Context from "../../context";
import withRoot from "../../withRoot";

const UserMemoryFeed = ({ classes }) => {
  const { dispatch } = useContext(Context);
  const [pins, setPins] = useState([]);

  // get user's pins
  useEffect(() => {
    const getUserPins = async () => {
      try {
        const { data } = await axios.get("/pins/me_pins");
        data ? setPins(data) : setPins([]);
      } catch (err) {
        console.log(err);
      }
    };
    getUserPins();
    return function() {
      setPins([]);
    };
  }, []);

  return (
    <Paper className={classes.card}>
      <Typography className={classes.title}>Your Memories</Typography>

      {pins.length > 0 ? null : (
        <p className={classes.noMemo}>You have no memories yet!</p>
      )}
      <List className={classes.root}>
        {pins.reverse().map((pin, index) => (
          <div key={index}>
            <hr />
            <ListItem key={index} alignItems="flex-start">
              <ListItemAvatar>
                <Avatar src={pin.image} alt={pin.title} />
              </ListItemAvatar>
              <ListItemText
                primary={pin.title}
                secondary={
                  <>
                    <Typography className={classes.content} component="span">
                      {pin.content}
                    </Typography>
                    <br />

                    <Typography
                      className={classes.date}
                      component="span"
                      color="secondary"
                    >
                      Created {distanceInWordsToNow(pin.date)} ago
                    </Typography>
                    <Button
                      onClick={() =>
                        dispatch({ type: "SET_PIN", payload: pin })
                      }
                      className={classes.button}
                      variant="outlined"
                      color="secondary"
                      type="submit"
                    >
                      View Memory
                    </Button>
                  </>
                }
              />
            </ListItem>
          </div>
        ))}
      </List>
    </Paper>
  );
};

const styles = theme => ({
  card: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    minWidth: 275,
    height: "calc(100vh - 64px)",
    maxHeight: "calc(100vh - 64px)",
    overflow: "scroll",
    backgroundColor: theme.palette.primary.dark
  },
  root: {
    width: "100%",
    backgroundColor: theme.palette.primary.dark
  },
  title: {
    color: "#fff",
    fontFamily: "Oswald",
    fontSize: "35px",
    marginTop: "35px"
  },
  noMemo: {
    color: "#fff",
    fontFamily: "Oswald",
    fontWeight: "light",
    fontSize: "20px",
    marginTop: "20%"
  },
  content: {
    display: "inline",
    fontFamily: "Oswald",
    fontSize: "16px",
    color: theme.palette.primary.light
  },
  date: {
    display: "flex",
    marginBottom: "5%",
    width: "100%"
  },
  button: {
    width: "40%",
    fontFamily: "Roboto",
    fontWeight: 500,
    fontSize: "10px",
    color: "#f5f5f5"
  }
});

export default withRoot(withStyles(styles)(UserMemoryFeed));
