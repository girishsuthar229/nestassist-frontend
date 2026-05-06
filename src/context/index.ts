export interface AdminDetailContextType {
  profileDetail: ProfileDetail | null;
  setProfileDetail: React.Dispatch<React.SetStateAction<ProfileDetail | null>>;
  loading: boolean;
  refetchProfileDetail: () => Promise<void>;
}

export type UserRoleS = "ADMIN" | "SUPER_ADMIN" | "SERVICE_PARTNER" | "CUSTOMER" ;

export interface ProfileDetail {
  id: number;
  name: string;
  email: string;
  country_code: string;
  mobile_number: string;
  role: string;
  profile_image?: {
    url: string;
    thumbnail: string;
    public_id: string;
  };
  permanent_address?: string;
  residential_address?: string;
  profile_address?: string;
  is_super_admin?: boolean;
  servicetypes?: { id: number; name: string }[];
  categories?: { id: number; name: string }[];
  subcategories?: { id: number; name: string }[];
}