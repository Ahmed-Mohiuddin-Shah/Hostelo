import { AuthContext } from "@/contexts/UserAuthContext";
import { useContext, useEffect, useState } from "react";
import useLocalStorage from "./useLocalStorage";

function useAuth() {
  const [auth, setAuth] = useState<boolean | null>(null);
  const authContext = useContext(AuthContext);
  const [localToken, _] = useLocalStorage("token", "");

  const validateToken = async () => {
    if (!!localToken) {
      const result = await authContext.login(localToken);
      setAuth(result);
    }
    if (localToken.length === 0) setAuth(false);
  };
  useEffect(() => {
    validateToken();
  }, []);

  return auth;
}

export default useAuth;
