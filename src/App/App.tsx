import { Switch, Route, useHistory, useLocation } from "react-router-dom";
import {
  Box,
  CssBaseline,
  ThemeProvider,
  Container,
  IconButton,
} from "@material-ui/core";

import { routes } from "./routes";
import type { Route as CustomRoute } from "./routes";

import SettingsApplicationsRoundedIcon from "@material-ui/icons/SettingsApplicationsRounded";
import HomeRoundedIcon from "@material-ui/icons/HomeRounded";

import theme from "./theme";

export default function App() {
  const { push } = useHistory();
  const { pathname } = useLocation();
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md">
        <Box
          display="flex"
          borderBottom={1}
          marginBottom={3}
          borderColor="grey.500"
        >
          {pathname !== "/" && (
            <Box display="flex" justifyContent="flex-start" flexGrow={1}>
              <IconButton
                aria-label="settings"
                edge="start"
                onClick={() => push("")}
              >
                <HomeRoundedIcon />
              </IconButton>
            </Box>
          )}
          {pathname !== "/settings" && (
            <Box display="flex" justifyContent="flex-end" flexGrow={1}>
              <IconButton
                aria-label="settings"
                edge="end"
                style={{ opacity: 0.5 }}
                onClick={() => push("/settings")}
              >
                <SettingsApplicationsRoundedIcon />
              </IconButton>
            </Box>
          )}
        </Box>

        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="calc(100vh - 74px)"
        >
          <Switch>
            {routes.map(({ path, component, exact }: CustomRoute) => (
              <Route
                key={path}
                path={path}
                component={component}
                exact={exact || false}
              />
            ))}
          </Switch>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
