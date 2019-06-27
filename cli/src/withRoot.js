import React from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import amber from "@material-ui/core/colors/amber";
import CssBaseline from "@material-ui/core/CssBaseline";

const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      light: "#7f7f7f",
      main: "#323232",
      dark: "#191919"
    },
    secondary: {
      light: amber[200],
      main: amber[400],
      dark: amber[800]
    }
  },
  typography: {
    useNextVariants: true
  }
});

function withRoot(Component) {
  function WithRoot(props) {
    // MuiThemeProvider makes the theme available down the React tree
    // thanks to React context.
    return (
      <MuiThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        {/* https://material-ui.com/getting-started/usage/#cssbaseline */}
        <CssBaseline />
        <Component {...props} />
      </MuiThemeProvider>
    );
  }

  return WithRoot;
}

export default withRoot;
