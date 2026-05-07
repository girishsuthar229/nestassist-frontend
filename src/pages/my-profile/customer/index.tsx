import { useState, useEffect } from "react";

import { ContactInfo } from "@/components/profile/ContactInfo";
import { SavedAddresses } from "@/components/profile/SavedAddresses";
import type { ICustomerProfile } from "@/types/masterData.interface";
import { ProfileSkeleton } from "@/components/profile/ProfileSkeleton";
import { PROFILE_TEXT } from "@/constants/profile.text";
import { useAdminDetail } from "@/context/AdminDetailContext";
import { displayRole } from "@/utils";

const MyProfile = () => {
  const [profileData, setProfileData] = useState<ICustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { profileDetail, refetchProfileDetail } = useAdminDetail();

  useEffect(() => {
    setLoading(true);
    if (profileDetail){
      const mobile_number_with_code: string =
      profileDetail.country_code && profileDetail.mobile_number
        ? `+${profileDetail.country_code} ${profileDetail.mobile_number}`
        : "";
      const mappedData: ICustomerProfile = {
        id: profileDetail?.id,
        name: profileDetail.name,
        email: profileDetail.email,
        country_code: profileDetail?.country_code,
        mobile_number: profileDetail?.mobile_number,
        mobile_number_with_code: mobile_number_with_code,
        role: displayRole(profileDetail.role),
        is_active: profileDetail?.is_active || false,
        addresses: profileDetail.addresses || [],
      };
      setProfileData(mappedData);
    }
    setLoading(false);
  }, [profileDetail]);

  if (loading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="flex flex-col bg-white font-alexandria">
      <main className="grow container mx-auto px-4 py-12 max-w-300">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-6">
            <h1 className="text-xl font-bold text-ink">{PROFILE_TEXT.title}</h1>
          </div>

          <div className="flex flex-col gap-8">
            <ContactInfo
              email={profileData?.email}
              mobileNumber={profileData?.mobile_number || ''}
              countryCode={profileData?.country_code || ''}
              onProfileUpdate={refetchProfileDetail}
            />
            <SavedAddresses initialAddresses={profileData?.addresses || []} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyProfile;
