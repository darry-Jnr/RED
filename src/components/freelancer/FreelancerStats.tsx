import { useEffect, useState } from "react";
import {
    ArrowUpIcon,
    BoxIconLine,
    GroupIcon,
} from "../../icons";
import { db, auth } from "../../firebase/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function FreelancerStats() {
    const [activeJobs, setActiveJobs] = useState(0);
    const [completedJobs, setCompletedJobs] = useState(0);
    const [totalEarnings, setTotalEarnings] = useState(0);

    useEffect(() => {
        const fetchStats = async () => {
            const user = auth.currentUser;
            if (!user) return;

            try {
                const jobsQuery = query(
                    collection(db, "jobs"),
                    where("freelancerId", "==", user.uid)
                );

                const jobsSnapshot = await getDocs(jobsQuery);

                let active = 0;
                let completed = 0;
                let earnings = 0;

                jobsSnapshot.forEach((doc) => {
                    const job = doc.data();

                    if (job.status === "active") active++;
                    if (job.status === "completed") completed++;

                    // ✅ Only count earnings if job is paid and approved
                    if (
                        job.paid === true &&
                        job.approved === true &&
                        typeof job.budget === "number"
                    ) {
                        earnings += job.budget;
                    }
                });

                setActiveJobs(active);
                setCompletedJobs(completed);
                setTotalEarnings(earnings);
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
            {/* Active Jobs */}
            <StatCard
                title="Active Jobs"
                value={activeJobs}
                icon={<BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />}
            />

            {/* Completed Jobs */}
            <StatCard
                title="Jobs Completed"
                value={completedJobs}
                icon={<GroupIcon className="text-gray-800 size-6 dark:text-white/90" />}
            />

            {/* Total Earnings */}
            <StatCard
                title="Total Earnings"
                value={`₦${totalEarnings.toLocaleString()}`}
                icon={<span className="text-lg">💰</span>}
            />
        </div>
    );
}

function StatCard({
    title,
    value,
    icon,
}: {
    title: string;
    value: any;
    icon: any;
}) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                {icon}
            </div>
            <div className="flex items-end justify-between mt-5">
                <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{title}</span>
                    <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                        {value}
                    </h4>
                </div>
            </div>
        </div>
    );
}
