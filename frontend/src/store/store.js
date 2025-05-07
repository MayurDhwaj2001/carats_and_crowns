import { createContext } from "react";

const authContext = createContext({
  token: null,
  userName: null,
  setToken: () => {},
  setUserName: () => {}
});

export default authContext;