import React, { useContext } from "react";
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

const FriendMemoryFeed = ({ classes }) => {
  const { state, dispatch } = useContext(Context);
  const { currentAuthor, friendMemories } = state;

  return (
    <Paper className={classes.card}>
      <Typography className={classes.title}>
        {state.currentAuthor.name}'s Memories
      </Typography>
      {friendMemories.length > 0 ? null : (
        <p className={classes.noMemo}>
          {currentAuthor.name} has no memories yet!
        </p>
      )}
      <List className={classes.root}>
        {friendMemories.reverse().map((pin, index) => (
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
    display: "inline"
  },
  button: {
    fontFamily: "Roboto",
    fontWeight: 500,
    fontSize: "10px",
    color: "#f5f5f5",
    float: "right"
  }
});

export default withRoot(withStyles(styles)(FriendMemoryFeed));
