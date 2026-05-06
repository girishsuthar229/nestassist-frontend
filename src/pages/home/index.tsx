import { lazy, Suspense, memo } from "react";
import HomePageSkeleton from "@/components/home/HomePageSkeleton";

const HeroSection = lazy(() => import("@/components/home/HeroSection"));
const CategoriesSection = lazy(
  () => import("@/components/home/CategoriesSection"),
);
const PopularServicesSection = lazy(
  () => import("@/components/home/PopularServiceSection"),
);
const AllServicesSection = lazy(
  () => import("@/components/home/AllServicesSection"),
);
const JoinPartnerSection = lazy(
  () => import("@/components/home/JoinPartnerSection"),
);

const HomePage = memo(() => {
  return (
    <main className="flex-1">
      <Suspense fallback={<HomePageSkeleton />}>
        <HeroSection />
        <CategoriesSection />
        <PopularServicesSection />
        <AllServicesSection />
        <JoinPartnerSection />
      </Suspense>
    </main>
  );
});

export default HomePage;
