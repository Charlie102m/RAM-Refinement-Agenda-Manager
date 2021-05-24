import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Box, Typography, TextField, Button } from "@material-ui/core";
import { useSettingsRepository } from "../../Data";

const Settings = () => {
  const { push } = useHistory();
  const { saveToken, getToken, token, saveBaseUrl, getBaseUrl, baseUrl } =
    useSettingsRepository();

  const [tokenFieldValue, setTokenFieldValue] = useState(token);
  const [baseUrlFieldValue, setBaseUrlFieldValue] = useState(baseUrl);

  const updateToken = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    saveToken(tokenFieldValue);
    push("/");
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => getToken(), []);

  useEffect(() => {
    setTokenFieldValue(token);
  }, [token]);

  const updateBaseUrl = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Field Value", baseUrlFieldValue);
    saveBaseUrl(baseUrlFieldValue);
    push("/");
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => getBaseUrl(), []);

  useEffect(() => {
    setBaseUrlFieldValue(baseUrl);
  }, [baseUrl]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      flexGrow={1}
      alignSelf="flex-start"
      textAlign="left"
    >
      <Typography variant="h1" color="textPrimary">
        Settings
      </Typography>
      <form onSubmit={updateToken} noValidate autoComplete="off">
        <Box marginY={2}>
          <Typography variant="subtitle1" color="textSecondary" paragraph>
            To leverage the ADO integration, you must provide an ADO
            authentication token in the field below.
          </Typography>
          <TextField
            variant="outlined"
            label="Token"
            type="password"
            value={tokenFieldValue}
            onChange={(e) => setTokenFieldValue(e.target.value)}
            fullWidth
          />
        </Box>

        <Button variant="contained" color="primary" type="submit">
          Save Token
        </Button>
      </form>
      <form onSubmit={updateBaseUrl} noValidate autoComplete="off">
        <Box marginY={2}>
          <Typography variant="subtitle1" color="textSecondary" paragraph>
            Base URL used to lookup your work item.
          </Typography>
          <TextField
            variant="outlined"
            label="Base Url"
            value={baseUrlFieldValue}
            onChange={(e) => setBaseUrlFieldValue(e.target.value)}
            fullWidth
          />
        </Box>

        <Button variant="contained" color="primary" type="submit">
          Save Base Url
        </Button>
      </form>
    </Box>
  );
};

export default Settings;
