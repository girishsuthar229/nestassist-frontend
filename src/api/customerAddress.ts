import axiosInstance from "@/helper/axiosInstance";

export interface Address {
  id: number;
  label: string;
  custom_label: string | null;
  display_label: string;
  house_flat_number: string;
  landmark: string;
  address: string;
  latitude: number;
  longitude: number;
  full_address: string;
}

export interface AddressRequest {
  label: string;
  custom_label?: string;
  house_flat_number: string;
  landmark: string;
  address: string;
  latitude: number;
  longitude: number;
  city?: string;
  state?: string;
  country?: string;
  postcode?: string;
}

export interface AddressResponse {
  success: boolean;
  message: string;
  data: Address[];
}

export const getAddresses = async (): Promise<AddressResponse> => {
  const response = await axiosInstance.get("customer/profile/addresses");
  return response.data;
};

export const getRecentSearches = async () => {
  const response = await axiosInstance.get("customer/profile/recent-searches");
  return response;
};

export const addAddress = async (data: AddressRequest): Promise<{ success: boolean; data: Address }> => {
  const response = await axiosInstance.patch("customer/profile/save-address", data);
  return response.data;
};

export const updateAddress = async (id: number | string, data: AddressRequest): Promise<{ success: boolean; data: Address }> => {
  const payload = { id: id, ...data }
  const response = await axiosInstance.patch(`customer/profile/save-address`, payload);
  return response.data;
};

export const deleteAddress = async (id: number | string): Promise<{ success: boolean; message: string }> => {
  const response = await axiosInstance.delete(`customer/profile/addresses/${id}`);
  return response.data;
};
