import { useState } from "react";

import type { Token } from "./index.d";

import { GETTOKEN, SAVETOKEN } from "./Requests";

const { ipcRenderer } = window.require("electron");

/**
 * A repository used to perform CRUD operations on the auth token
 */
const useTokenRepository = () => {
  const [token, setToken] = useState<Token>("");

  const saveToken = (token: Token) => {
    ipcRenderer.send(SAVETOKEN, token);
    ipcRenderer.on(`${GETTOKEN}-response`, (event: any, token: Token) => {
      setToken(token);
    });
  };

  const getToken = () => {
    ipcRenderer.send(GETTOKEN);
    ipcRenderer.on(`${GETTOKEN}-response`, (event: any, token: Token) => {
      setToken(token);
    });
  };

  return { saveToken, getToken, token };
};

export default useTokenRepository;
