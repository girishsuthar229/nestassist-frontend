import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import axios from "axios";

import { Button } from "@/components/ui/button";
import DynamicFormFields from "@/components/common/DynamicFormFields";
import { adminLoginStyles } from "../config/auth.styles";
import AdminAuthLayout from "@/components/layout/auth/AdminAuthLayout";
import {
  adminLoginFields,
  urlStrings,
} from "../config/constant";
import { authLoginSchema } from "@/schemas";
import axiosInstance from "@/helper/axiosInstance";
import { APP_ROUTES } from "@/routes/config";
import AdminCommonHeader from "@/components/auth/AdminCommonHeader";
import { ADMIN_AUTH_BUTTON_TEXTS, ADMIN_AUTH_TEXTS } from "@/constants/auth.text";
import { ROLES } from "@/enums/roles.enum";
import toast from "react-hot-toast";

export const AdminLogin = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: authLoginSchema,
    onSubmit: async (values) => {
      setServerError(null);
      try {
        const response = await axiosInstance.post(urlStrings.authLogin, values);
        console.log("responseresponseresponse",response.data)
        if (response.data.success) {
          toast.success("Login successful!");
          const user = response.data.data.user;
          const token = response.data.data.token;
          const role = user.role;
          if(token && user){
            localStorage.setItem("authToken", token);
            localStorage.setItem("authinfo", JSON.stringify(user));
          }
          if (role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN || user.is_super_admin) {
            navigate(APP_ROUTES.ADMIN_DASHBOARD);
          } else if (role === ROLES.SERVICE_PARTNER) {
            navigate(APP_ROUTES.SERVICE_PARTNER_DASHBOARD);
          } else {
            setServerError(ADMIN_AUTH_TEXTS.somethingWentWrong);
          }
        }
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          const message =
            error.response?.data?.message ||
            error.message ||
            ADMIN_AUTH_TEXTS.somethingWentWrong;

          setServerError(message);
        }
      }
    },
  });

  const navigateToForgot = () => {
    navigate(APP_ROUTES.AUTH_FORGOT_PASSWORD);
  };

  return (
    <AdminAuthLayout>
      <AdminCommonHeader title={ADMIN_AUTH_TEXTS.loginTitle} />

      {serverError && (
        <p className={adminLoginStyles.serverError}>{serverError}</p>
      )}

      <form
        noValidate
        onSubmit={formik.handleSubmit}
        className={adminLoginStyles.form}
      >
        <DynamicFormFields fields={adminLoginFields} formik={formik} />

        <div className={adminLoginStyles.forgotRow}>
          <button
            type="button"
            className={adminLoginStyles.forgotButton}
            onClick={navigateToForgot}
          >
            {ADMIN_AUTH_BUTTON_TEXTS.forgotPassword}
          </button>
        </div>

        <Button
          type="submit"
          disabled={
            formik.isSubmitting ||
            !formik.values.email?.trim() ||
            !formik.values.password?.trim()
          }
          className={adminLoginStyles.submitButton}
        >
          {formik.isSubmitting ? ADMIN_AUTH_BUTTON_TEXTS.signingIn : ADMIN_AUTH_BUTTON_TEXTS.signIn}
        </Button>
      </form>
    </AdminAuthLayout>
  );
};

export default AdminLogin;
