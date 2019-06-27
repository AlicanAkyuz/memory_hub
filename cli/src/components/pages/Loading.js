import React from "react";
import { withStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

import withRoot from "../../withRoot";

const Loading = ({ classes }) => {
  return (
    <div className={classes.root}>
      <CircularProgress
        className={classes.progress}
        color="secondary"
        size={60}
        thickness={5}
      />
    </div>
  );
};

const styles = theme => ({
  root: {
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  progress: {
    margin: theme.spacing.unit * 2
  }
});

export default withRoot(withStyles(styles)(Loading));
