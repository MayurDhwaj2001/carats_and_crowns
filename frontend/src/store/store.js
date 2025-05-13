import { createContext } from "react";

const authContext = createContext({
  token: null,
  userName: null,
  userRole: null,
  setToken: () => {},
  setUserName: () => {},
  setUserRole: () => {}
});

export default authContext;