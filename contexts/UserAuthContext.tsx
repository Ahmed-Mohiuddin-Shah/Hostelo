import { verifyJWT } from "@/libs/auth";
import React, { createContext, useState } from "react";

interface AuthUserInfo {
  username: string;
  role: string;
  image_url?: string;
  expires: number;
}

interface AuthContextType {
  userInfo: AuthUserInfo | null;
  token: string;
  isLoggedIn: boolean;
  login: (token: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  userInfo: null,
  token: "",
  isLoggedIn: false,
  login: (token: string) => new Promise(() => {}),
  logout: () => {},
});

const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode => {
  const [token, setToken] = useState("");
  const [userInfo, setUserInfo] = useState<AuthUserInfo | null>(null);

  const loginHandler = async (token: string): Promise<boolean> => {
    const dataInToken = await verifyJWT(token);
    if (!dataInToken) {
      return false;
    }

    const userInfo: AuthUserInfo = {
      username: dataInToken.username as string,
      role: dataInToken.role as string,
      expires: dataInToken.exp as number,
      image_url: dataInToken.image_url as string,
    };

    setToken(token);
    setUserInfo(userInfo);
    return true;
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
