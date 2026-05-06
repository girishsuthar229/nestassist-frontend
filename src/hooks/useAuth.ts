import { useState, useEffect } from "react";

import { ROLES } from "@/enums/roles.enum";

export const useAuth = () => {
  const [user, setUser] = useState<Record<string, unknown> | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPartner, setIsPartner] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    const accessToken = localStorage.getItem("accessToken");
    const authInfoRaw = localStorage.getItem("authinfo");

    const token = authToken || accessToken;

    if (token) {
      setIsAuthenticated(true);

      if (authInfoRaw) {
        try {
          const userData = JSON.parse(authInfoRaw);
          setUser(userData);
          setIsAdmin(
            userData?.role === ROLES.ADMIN ||
              userData?.role === ROLES.SUPER_ADMIN ||
              Boolean(userData?.is_super_admin)
          );
          setIsPartner(userData?.role === ROLES.SERVICE_PARTNER);
        } catch (err) {
          console.error("Failed to parse admin info", err);
        }
      }
    }
  }, []);

  return { user, isAdmin, isPartner, isAuthenticated };
};
