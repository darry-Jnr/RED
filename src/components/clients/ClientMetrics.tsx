import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../../firebase/firebaseConfig";
import {
    BoxIconLine,
    GroupIcon,
    ArrowUpIcon,

} from "../../icons";
import Badge from "../ui/badge/Badge";

export default function ClientMetrics() {
    const [active, setActive] = useState(0);
    const [completed, setCompleted] = useState(0);
    const [pending, setPending] = useState(0);
    const [spent, setSpent] = useState(0);

    useEffect(() => {
        const fetchMetrics = async () => {
            const user = auth.currentUser;
            if (!user) return;

            const q = query(collection(db, "jobs"), where("clientId", "==", user.uid));
            const snapshot = await getDocs(q);

            let activeCount = 0;
            let completedCount = 0;
            let pendingCount = 0;
            let totalSpent = 0;

            snapshot.forEach((doc) => {
                const job = doc.data();
                const status = job.status;

                if (status === "in_progress") activeCount++;
                if (status === "completed") {
                    completedCount++;
                    totalSpent += job.price || 0;
                }
                if (status === "delivered") pendingCount++;
            });

            setActive(activeCount);
            setCompleted(completedCount);
            setPending(pendingCount);
            setSpent(totalSpent);
        };

        fetchMetrics();
    }, []);

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-4">
            {/* Active Jobs */}
            <MetricCard
                icon={<GroupIcon className="text-gray-800 size-6 dark:text-white/90" />}
                label="Active Jobs"
                value={active}
                badgeColor="success"
            />

            {/* Completed Jobs */}
            <MetricCard
                icon={<BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />}
                label="Completed Jobs"
                value={completed}
                badgeColor="success"
            />

            {/* Pending Deliveries */}
            <MetricCard
                icon={<GroupIcon className="text-gray-800 size-6 dark:text-white/90" />}
                label="Pending Deliveries"
                value={pending}
                badgeColor="warning"
            />

            {/* Total Spent */}
            <MetricCard
                icon={<BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />}
                label="Total Spent"
                value={`₦${spent.toLocaleString()}`}
                badgeColor="info"
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
    icon: JSX.Element;
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
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {label}
                    </span>
                    <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                        {value}
                    </h4>
                </div>

                {/* Optional badge — can hide or show % later */}
                <Badge color={badgeColor}>
                    <ArrowUpIcon />
                    {/* Replace with actual percent if needed */}
                    0%
                </Badge>
            </div>
        </div>
    );
};
