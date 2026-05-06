import React, { createContext, useContext, useEffect, useState } from "react";
import type { ProfileDetail, AdminDetailContextType } from ".";
import { useAuth } from "@/hooks/useAuth";
import { getProfile } from "@/api/partnerProfile";

const AdminDetailContext = createContext<AdminDetailContextType | undefined>(
  undefined
);

export const AdminDetailProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [profileDetail, setProfileDetail] = useState<ProfileDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const { isAdmin, isPartner } = useAuth();

  const fetchProfileDetail = async () => {
    try {
      setLoading(true);
      const res = await getProfile();
      setProfileDetail(res.data.data);
    } catch (err) {
      console.error("Failed to fetch admin detail", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin || isPartner) {
      fetchProfileDetail();
    }
  }, [isAdmin, isPartner]);


  return (
    <AdminDetailContext.Provider
      value={{
        profileDetail,
        setProfileDetail,
        loading,
        refetchProfileDetail: fetchProfileDetail,
      }}
    >
      {children}
    </AdminDetailContext.Provider>
  );
};

export const useAdminDetail = () => {
  const context = useContext(AdminDetailContext);
  if (!context) {
    throw new Error("useAdminDetail must be used within AdminDetailProvider");
  }
  return context;
};
