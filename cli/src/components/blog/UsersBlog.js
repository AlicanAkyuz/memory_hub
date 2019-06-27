import React, { useContext } from "react";
import { distanceInWordsToNow } from "date-fns";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import AccessTime from "@material-ui/icons/AccessTime";
import Avatar from "@material-ui/core/Avatar";
import { Link } from "react-router-dom";

import Context from "../../context";
import withRoot from "../../withRoot";
import Comments from "../comment/Comments";
import CreateComment from "../comment/CreateComment";

const UsersBlog = ({ classes }) => {
  const { state } = useContext(Context);

  console.log(state);

  const { _id, title, image, content, author, date } = state.currentPin;

  return (
    <div className={classes.root}>
      <div className={classes.titleContainer}>
        <Typography className={classes.title}>{title}</Typography>

        <Link to="/profile" className={classes.link}>
          by&nbsp;<h2 className={classes.author}>{author}</h2>
          <Avatar
            alt={state.user.name}
            src={
              state.profile && state.profile.image
                ? state.profile.image
                : state.user.avatar
            }
            className={classes.avatar}
          />
        </Link>
      </div>

      <div className={classes.imageContainer}>
        <img src={image} alt="user memory" className={classes.userMemory} />
      </div>

      <div className={classes.contentContainer}>
        <Typography className={classes.content}>{content}</Typography>
      </div>

      <Typography className={classes.date}>
        <AccessTime className={classes.icon} />
        Created {distanceInWordsToNow(date)} ago by
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
    maxWidth: 320
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
  avatar: {
    width: 30,
    height: 30,
    marginLeft: theme.spacing.unit
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
  contentContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: theme.spacing.unit * 2
  },
  content: {
    color: "#fff",
    fontFamily: "Roboto",
    fontSize: "15px",
    fontWeight: 300
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
  icon: {
    marginRight: theme.spacing.unit
  },
  author: {
    fontWeight: 400,
    fontSize: "15px"
  }
});

export default withRoot(withStyles(styles)(UsersBlog));
