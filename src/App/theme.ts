import { createMuiTheme } from "@material-ui/core";
import { grey } from "@material-ui/core/colors";

export default createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: grey[50],
      dark: grey[500],
    },
    text: {
      primary: grey[50],
    },
  },
  typography: {
    h1: {
      fontSize: "3rem",
    },
  },
});
