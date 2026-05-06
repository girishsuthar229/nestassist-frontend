import axiosInstance from "@/helper/axiosInstance";
import type {
  UpdateContactPayload,
  UpdatePasswordPayload,
  UpdateServicesPayload,
} from "@/types/profile/partner.interface";
import { PROFILE_UPDATE_TYPE } from "@/utils/constants";

export const getProfile = () => axiosInstance.get("/user-profile/profile");

export const updateContact = (payload: UpdateContactPayload, role: string) =>
  axiosInstance.put("/user-profile/update-profile", {
    type: PROFILE_UPDATE_TYPE.CONTACT,
    role: role,
    mobile: payload.mobile,
    email: payload.email,
    permanent_address: payload.permanent_address,
    residential_address: payload.residential_address,
    profile_address: payload.profile_address,
  });

export const updatePassword = (payload: UpdatePasswordPayload, role: string) =>
  axiosInstance.put("/user-profile/update-profile", {
    type: PROFILE_UPDATE_TYPE.PASSWORD,
    role: role,
    current_password: payload.current_password,
    password: payload.password,
    password_confirmation: payload.password_confirmation,
  });

export const updateProfileImage = (file: File, role: string) => {
  const formData = new FormData();
  formData.append("type", PROFILE_UPDATE_TYPE.IMAGE);
  formData.append("role", role);
  formData.append("profile_image", file);

  return axiosInstance.put("/user-profile/update-profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateServices = (payload: UpdateServicesPayload, role: string) =>
  axiosInstance.put("/user-profile/update-profile", {
    type: PROFILE_UPDATE_TYPE.SERVICES,
    role: role,
    categories: payload.categories,
    subcategories: payload.subcategories,
    servicetypes: payload.servicetypes,
  });
