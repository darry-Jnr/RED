import ClientMetrics from "../../../components/clients/ClientMetrics";
import MonthlySpendingChart from "../../../components/clients/MonthlySpendingChart";

import ClientNewsSection from "../../../components/clients/ClientNewsSection";
import ClientRecentJobs from "../../../components/clients/ClientRecentJobs";
import ClientTipCard from "../../../components/clients/ClientTipCard";
import ClientJobSummaryCard from "../../../components/clients/ClientJobSummaryCard";
import PageMeta from "../../../components/common/PageMeta";

export default function ClientsHome() {
  return (
    <>
      <PageMeta
        title="Red | Client Dashboard"
        description="Manage your job posts, messages, and profile as a client on Red."
      />

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <ClientMetrics />

          <MonthlySpendingChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <ClientNewsSection />
        </div>

        <div className="col-span-12">
          <ClientTipCard />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <ClientJobSummaryCard />
        </div>

        <div className="col-span-12 xl:col-span-7">
          <ClientRecentJobs />
        </div>
      </div>
    </>
  );
}
