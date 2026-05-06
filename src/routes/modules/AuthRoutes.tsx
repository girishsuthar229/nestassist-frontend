import React from "react";
import { Route } from "react-router-dom";
import { APP_ROUTES } from "@/routes/config";
import GuestGuard from "@/guards/GuestGuard";

// Auth Pages
const CustomerLogin = React.lazy(() => import("@/pages/auth/customer/Login"));
const CustomerOtp = React.lazy(() => import("@/pages/auth/customer/OtpVerification"));
const AdminLogin = React.lazy(() => import("@/pages/auth/admin/Login"));
const AdminForgotPassword = React.lazy(() => import("@/pages/auth/admin/ForgotPassword"));
const AdminResetPassword = React.lazy(() => import("@/pages/auth/admin/ResetPassword"));

const authRoutes = [
  <Route key="user-auth" element={<GuestGuard />}>
    <Route path={APP_ROUTES.AUTH_LOGIN} element={<AdminLogin />} />
    <Route path={APP_ROUTES.AUTH_FORGOT_PASSWORD} element={<AdminForgotPassword />} />
    <Route path={APP_ROUTES.AUTH_RESET_PASSWORD} element={<AdminResetPassword />} />
    <Route path={APP_ROUTES.ADMIN} element={<AdminLogin />} />
    <Route path={APP_ROUTES.SERVICE_PARTNER} element={<AdminLogin />} />
  </Route>,
  <Route key="customer-auth" element={<GuestGuard />}>
    <Route path={APP_ROUTES.LOGIN} element={<CustomerLogin />} />
    <Route path={APP_ROUTES.CUSTOMER_OTP} element={<CustomerOtp />} />
  </Route>
];

export default authRoutes;
