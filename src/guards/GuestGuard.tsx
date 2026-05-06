import React, { type ReactNode, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { APP_ROUTES } from "../routes/config";
import { ROLES } from "@/enums/roles.enum";

interface IProps {
  children?: ReactNode;
}

const GuestGuard = ({ children }: IProps) => {
  const navigate = useNavigate();
  const authToken = localStorage.getItem("authToken");
  const authInfoRaw = localStorage.getItem("authinfo");
  const isAuthenticated = Boolean(authToken || authInfoRaw);

  useEffect(() => {
    let user = null;
    if (authInfoRaw) {
      try {
        user = JSON.parse(authInfoRaw);
      } catch {
        console.error("Invalid user info in localStorage");
      }
    }
    if (isAuthenticated) {
      // If admin, go to admin dashboard/master data, else go to home
      if (user?.role === ROLES.ADMIN || user?.role === ROLES.SUPER_ADMIN) {
        navigate(APP_ROUTES.ADMIN_DASHBOARD);
      } else if (user?.role === ROLES.SERVICE_PARTNER) {
        navigate(APP_ROUTES.SERVICE_PARTNER_DASHBOARD);
      } else {
        navigate(APP_ROUTES.HOME);
      }
    }
  }, [isAuthenticated, authToken, authInfoRaw, navigate]);

  return children ? <>{children}</> : <Outlet />;
};

export default React.memo(GuestGuard);
