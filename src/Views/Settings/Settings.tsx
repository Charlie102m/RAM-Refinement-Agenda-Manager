import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Box, Typography, TextField, Button } from "@material-ui/core";
import { useTokenRepository } from "../../Data";

const Settings = () => {
  const { push } = useHistory();
  const { saveToken, getToken, token } = useTokenRepository();

  const [fieldValue, setFieldValue] = useState(token);

  const updateToken = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    saveToken(fieldValue);
    push("/");
  };

  useEffect(() => getToken(), []);

  useEffect(() => {
    setFieldValue(token);
  }, [token]);

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
            value={fieldValue}
            onChange={(e) => setFieldValue(e.target.value)}
            fullWidth
          />
        </Box>

        <Button variant="contained" color="primary" type="submit">
          Save Changes
        </Button>
      </form>
    </Box>
  );
};

export default Settings;
