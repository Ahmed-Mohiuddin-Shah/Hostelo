import { AuthContext } from "@/contexts/UserAuthContext";
import { useContext } from "react";

export default function useAccess(authorizedRoles: string[]) {
  const authContext = useContext(AuthContext);
  const currentRole = authContext?.userInfo?.role;

  if (!currentRole) return false;
  return authorizedRoles.includes(currentRole);
}
