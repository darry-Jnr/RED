
import FreelancerStats from "../../../components/freelancer/FreelancerStats";
import MonthlyEarningsChart from "../../../components/freelancer/MonthlyEarningsChart";
import FreelancerNewsSection from "../../../components/freelancer/FreelancerNewsSection";
import MotivationCarousel from "../../../components/freelancer/MotivationCarousel";
import EarningsThisMonthCard from "../../../components/freelancer/EarningsThisMonthCard";
import RecentProjects from "../../../components/freelancer/RecentProjects";

import PageMeta from "../../../components/common/PageMeta";

export default function Home() {
  return (
    <>
      <PageMeta
        title="Red | Freelancer Dashboard"
        description="Access your freelancer dashboard to manage jobs, messages, and profile on Red."
      />

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <FreelancerStats />

          <MonthlyEarningsChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <FreelancerNewsSection />
        </div>

        <div className="col-span-12">
          <MotivationCarousel />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <EarningsThisMonthCard />
        </div>

        <div className="col-span-12 xl:col-span-7">
          <RecentProjects />
        </div>
      </div>
    </>
  );
}
