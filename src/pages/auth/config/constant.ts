import type { DynamicFormField } from "@/components/common/DynamicFormFields";
import type {
  IAdminLogin,
  IForgotPassword,
  IPartnerResetPassword,
  IResetPassword,
} from "@/types/auth/index.interface";



export const urlStrings = {
  authLogin: "/auth/login",
  authForgotPassword: "/auth/forgot-password",
  authVerifyResetToken: "/auth/verify-reset-token",
  authResetPassword: "/auth/reset-password",
  authLogout: "/auth/logout",

  customerLogin: "/v1/customer/send-otp",
  customerVerifyOtp:"/v1/customer/verify-otp",
  customerResendOtp:"/v1/customer/resend-otp",
};

export const adminLoginFields: DynamicFormField<IAdminLogin>[] = [
  {
    name: "email",
    label: "Email",
    fieldType: "input",
    inputType: "email",
    inputProps: {
      autoComplete: "email",
      placeholder: "Email",
      required: true,
    },
  },
  {
    name: "password",
    label: "Password",
    fieldType: "input",
    inputType: "password",
    inputProps: {
      autoComplete: "current-password",
      placeholder: "Password",
      required: true,
    },
  },
];

export const forgotPasswordFields: DynamicFormField<IForgotPassword>[] = [
  {
    name: "email",
    label: "Email",
    fieldType: "input",
    inputType: "email",
    inputProps: {
      autoComplete: "email",
      placeholder: "Enter your email address",
      required: true,
    },
  },
];

export const resetPasswordFields: DynamicFormField<IResetPassword>[] = [
  {
    name: "email",
    label: "Email",
    fieldType: "input",
    inputType: "email",
    inputProps: {
      autoComplete: "email",
      placeholder: "Email address",
      required: true,
      disabled: true,
    },
  },
  {
    name: "password",
    label: "New Password",
    fieldType: "input",
    inputType: "password",
    inputProps: {
      autoComplete: "new-password",
      placeholder: "Enter new password",
      required: true,
    },
  },
  {
    name: "confirmPassword",
    label: "Confirm Password",
    fieldType: "input",
    inputType: "password",
    inputProps: {
      autoComplete: "new-password",
      placeholder: "Confirm new password",
      required: true,
    },
  },
];

export const partnerResetPasswordFields: DynamicFormField<IPartnerResetPassword>[] =
  [
    {
      name: "password",
      label: "New Password",
      fieldType: "input",
      inputType: "password",
      inputProps: {
        autoComplete: "new-password",
        placeholder: "Enter new password",
        required: true,
      },
    },
    {
      name: "confirmPassword",
      label: "Confirm Password",
      fieldType: "input",
      inputType: "password",
      inputProps: {
        autoComplete: "new-password",
        placeholder: "Confirm new password",
        required: true,
      },
    },
  ];
