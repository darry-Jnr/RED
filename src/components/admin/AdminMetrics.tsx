import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { BoxIconLine, GroupIcon, ArrowUpIcon } from "../../icons";
import Badge from "../ui/badge/Badge";

export default function AdminMetrics() {
    const [freelancers, setFreelancers] = useState(0);
    const [clients, setClients] = useState(0);
    const [totalJobs, setTotalJobs] = useState(0);
    const [pendingJobs, setPendingJobs] = useState(0);
    const [withdrawals, setWithdrawals] = useState(0);
    const [revenue, setRevenue] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            // Users
            const usersSnapshot = await getDocs(collection(db, "users"));
            let freelancerCount = 0;
            let clientCount = 0;
            usersSnapshot.forEach((doc) => {
                const user = doc.data();
                if (user.role === "freelancer") freelancerCount++;
                else if (user.role === "client") clientCount++;
            });
            setFreelancers(freelancerCount);
            setClients(clientCount);

            // Jobs
            const jobsSnapshot = await getDocs(collection(db, "jobs"));
            let jobsTotal = 0;
            let jobsPending = 0;
            let totalRevenue = 0;
            jobsSnapshot.forEach((doc) => {
                const job = doc.data();
                jobsTotal++;
                if (job.status === "pending") jobsPending++;
                if (job.status === "completed" && job.price) {
                    totalRevenue += job.price;
                }
            });
            setTotalJobs(jobsTotal);
            setPendingJobs(jobsPending);
            setRevenue(totalRevenue);

            // Withdrawals
            const withdrawalsSnapshot = await getDocs(collection(db, "withdrawals"));
            setWithdrawals(withdrawalsSnapshot.size);
        };

        fetchData();
    }, []);

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-3">
            <MetricCard
                icon={<GroupIcon className="text-gray-800 size-6 dark:text-white/90" />}
                label="Freelancers"
                value={freelancers}
                badgeColor="success"
            />
            <MetricCard
                icon={<GroupIcon className="text-gray-800 size-6 dark:text-white/90" />}
                label="Clients"
                value={clients}
                badgeColor="info"
            />
            <MetricCard
                icon={<BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />}
                label="Total Jobs Posted"
                value={totalJobs}
                badgeColor="success"
            />
            <MetricCard
                icon={<BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />}
                label="Jobs Pending Approval"
                value={pendingJobs}
                badgeColor="warning"
            />
            <MetricCard
                icon={<GroupIcon className="text-gray-800 size-6 dark:text-white/90" />}
                label="Withdrawal Requests"
                value={withdrawals}
                badgeColor="warning"
            />
            <MetricCard
                icon={<BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />}
                label="Total Revenue"
                value={`₦${revenue.toLocaleString()}`}
                badgeColor="success"
            />
        </div>
    );
}

const MetricCard = ({
    icon,
    label,
    value,
    badgeColor = "success",
}: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    badgeColor?: "success" | "error" | "warning" | "info";
}) => {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                {icon}
            </div>
            <div className="flex items-end justify-between mt-5">
                <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
                    <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                        {value}
                    </h4>
                </div>
                <Badge color={badgeColor}>
                    <ArrowUpIcon />
                    0%
                </Badge>
            </div>
        </div>
    );
};
