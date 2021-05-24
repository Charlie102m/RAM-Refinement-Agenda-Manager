import { useState, useEffect, useCallback } from "react";

import type { Token, BaseUrl } from ".";

const { ipcRenderer } = window.require("electron");

/**
 * A repository used to perform CRUD operations on the auth token
 */
const useSettingsRepository = () => {
  const [token, setToken] = useState<Token>("");
  const [baseUrl, setBaseUrl] = useState<BaseUrl>("");

  const saveToken = (token: Token) => {
    ipcRenderer.send("save-token", token);
  };

  const getToken = () => {
    ipcRenderer.send("get-token");
  };

  useEffect(() => {
    ipcRenderer.on("get-token-response", handleTokenResponse);
    return () => {
      ipcRenderer.removeListener("get-token-response", handleTokenResponse);
    };
  });

  const handleTokenResponse = useCallback((_: any, token: Token) => {
    console.log("get-token-response", token);
    setToken(token);
  }, []);

  const saveBaseUrl = (baseUrl: BaseUrl) => {
    ipcRenderer.send("save-url", baseUrl);
  };

  const getBaseUrl = () => {
    ipcRenderer.send("get-url");
  };

  useEffect(() => {
    ipcRenderer.on("get-url-response", handleBaseUrlResponse);
    return () => {
      ipcRenderer.removeListener("get-url-response", handleBaseUrlResponse);
    };
  });

  const handleBaseUrlResponse = useCallback((_: any, baseUrl: BaseUrl) => {
    console.log("get-url-response", baseUrl);
    setBaseUrl(baseUrl);
  }, []);

  return { saveToken, getToken, token, saveBaseUrl, getBaseUrl, baseUrl };
};

export default useSettingsRepository;
