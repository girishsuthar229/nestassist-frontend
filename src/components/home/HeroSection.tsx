import { useNavigate } from "react-router-dom";

import { Container } from "@/components/layout/Container";
import { heroIllustration, iconGearSix, iconUsersThree } from "@/assets";
import { APP_ROUTES } from "@/routes/config";
import { getState, type HomeService } from "@/api/homeServices";
import { SearchBar } from "./SearchBar";
import { StatItem } from "./StatItem";
import { HOME_TEXT } from "@/constants/home.text";
import { useEffect, useState } from "react";
import { formatBookings } from "@/utils";

export type StatsCount = {
  customersCount: number;
  servicesCount: number;
};

const HeroSection = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<StatsCount>();
  const fetchStats = async () => {
    try {
      const res = await getState();
      const data: StatsCount = {
        customersCount: res.customersGlobally,
        servicesCount: res.servicesCount,
      };
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };
  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <section className="pt-8 sm:pt-14">
      <Container>
        <div className="grid items-center gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="flex max-w-131 flex-col gap-10 sm:gap-16">
            <div className="flex flex-col gap-6">
              <h1 className="text-[36px] font-bold leading-11.25 text-ink sm:text-[42px] sm:leading-13 lg:text-[48px] lg:leading-15">
                {HOME_TEXT.heroTitle}
              </h1>
              <p className="text-md font-normal mb-2 leading-6 tracking-[0.0015em] text-ink-muted sm:text-lg sm:leading-6.5">
                {HOME_TEXT.heroSubtitle}
              </p>

              <div className="order-2 sm:order-3">
                <div className="grid grid-cols-2 gap-4 sm:flex sm:flex-row sm:gap-16">
                  <StatItem
                    iconSrc={iconUsersThree}
                    value={formatBookings(stats?.customersCount || 0)}
                    label={HOME_TEXT.statCustomersLabel}
                    className="justify-center sm:justify-start"
                  />
                  <StatItem
                    iconSrc={iconGearSix}
                    value={formatBookings(stats?.servicesCount || 0)}
                    label={HOME_TEXT.statServicesLabel}
                    className="justify-center sm:justify-start"
                  />
                </div>
              </div>

              <div className="order-3 sm:order-2">
                <SearchBar
                  suggestionsEnabled={true}
                  maxSuggestions={5}
                  onSelectSuggestion={(service: HomeService) => {
                    navigate(
                      APP_ROUTES.SERVICE_DETAILS.replace(
                        ":serviceId",
                        String(service.id)
                      )
                    );
                  }}
                />
              </div>
            </div>
          </div>

          <div className="order-first flex justify-center lg:order-last lg:justify-end">
            <img
              src={heroIllustration}
              alt=""
              className="w-full max-w-105 sm:max-w-145"
            />
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HeroSection;
