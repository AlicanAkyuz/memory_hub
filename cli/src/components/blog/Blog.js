import React, { useContext } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";
import { unstable_useMediaQuery as useMediaQuery } from "@material-ui/core/useMediaQuery";

import Context from "../../context";
import CreateMemory from "./CreateMemory";
import UsersBlog from "./UsersBlog";
import OthersBlog from "./OthersBlog";

const Blog = ({ classes }) => {
  const mobileSize = useMediaQuery("(max-width: 650px)");

  const { state } = useContext(Context);
  const { draft, currentPin } = state;

  let BlogContent;

  // render diff blog content according to state
  if (currentPin) {
    // check if the user is the author of the currentPin
    state.user.name === state.currentPin.author
      ? (BlogContent = <UsersBlog />)
      : (BlogContent = <OthersBlog />);
  } else if (draft) {
    BlogContent = <CreateMemory />;
  }

  return (
    <Paper className={mobileSize ? classes.rootMobile : classes.root}>
      {BlogContent}
    </Paper>
  );
};

const styles = {
  root: {
    minWidth: 320,
    maxWidth: 320,
    minHeight: "calc(100vh - 64px)",
    overflow: "scroll",
    display: "flex"
  },
  ///////////////// MOBILE ////////////////
  rootMobile: {
    overflowX: "hidden",
    overflowY: "scroll",
    width: "100%",
    height: "100vh"
  }
};

export default withStyles(styles)(Blog);
