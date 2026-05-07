import type { PropsWithChildren } from "react";

import { Outlet } from "react-router-dom";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { AdminDetailProvider } from "@/context/AdminDetailContext";

const HomePageLayout = ({ children }: PropsWithChildren) => {
  return (
    <AdminDetailProvider>
      <div className="min-h-svh bg-background text-foreground">
        <Header />
        {children || <Outlet />}
        <Footer />
      </div>
    </AdminDetailProvider>
  );
};

export default HomePageLayout;
