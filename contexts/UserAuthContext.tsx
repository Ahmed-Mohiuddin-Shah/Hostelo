import React, { createContext, useState } from "react";

interface AuthContextType {
  userInfo: any; // TODO: Update this to proper type
  token: string;
  isLoggedIn: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  userInfo: null,
  token: "",
  isLoggedIn: false,
  login: (token: string) => {},
  logout: () => {},
});

const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode => {
  const [token, setToken] = useState("");
  const [userInfo, setUserInfo] = useState(null);

  const loginHandler = (token: string) => {
    setToken(token);
    setUserInfo({ name: "John Doe" });
  };

  const logoutHandler = () => {
    setToken("");
    setUserInfo(null);
  };

  const contextValue = {
    token,
    userInfo,
    isLoggedIn: !!token,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export { AuthContext, AuthContextProvider };
export type { AuthContextType };
