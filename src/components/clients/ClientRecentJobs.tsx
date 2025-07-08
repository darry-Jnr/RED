import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";

// Job interface (image removed)
interface Job {
    id: number;
    title: string;
    category: string;
    budget: string;
    status: "Ongoing" | "Completed" | "Cancelled";
}

// Placeholder data (will be replaced with backend later)
const jobData: Job[] = [
    {
        id: 1,
        title: "Build Marketing Website",
        category: "Web Development",
        budget: "$900",
        status: "Ongoing",
    },
    {
        id: 2,
        title: "Mobile App Design",
        category: "UI/UX",
        budget: "$1,200",
        status: "Completed",
    },
    {
        id: 3,
        title: "Logo and Brand Identity",
        category: "Graphic Design",
        budget: "$300",
        status: "Completed",
    },
    {
        id: 4,
        title: "SEO Optimization",
        category: "Marketing",
        budget: "$500",
        status: "Cancelled",
    },
    {
        id: 5,
        title: "Custom Plugin Development",
        category: "WordPress",
        budget: "$750",
        status: "Ongoing",
    },
];

export default function ClientRecentJobs() {
    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
            <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                        Recent Job Orders
                    </h3>
                </div>

                <div className="flex items-center gap-3">
                    <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
                        Filter
                    </button>
                    <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
                        See all
                    </button>
                </div>
            </div>

            <div className="max-w-full overflow-x-auto">
                <Table>
                    <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
                        <TableRow>
                            <TableCell isHeader className="py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400 font-medium">
                                Job Title
                            </TableCell>
                            <TableCell isHeader className="py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400 font-medium">
                                Category
                            </TableCell>
                            <TableCell isHeader className="py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400 font-medium">
                                Budget
                            </TableCell>
                            <TableCell isHeader className="py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400 font-medium">
                                Status
                            </TableCell>
                        </TableRow>
                    </TableHeader>

                    <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {jobData.map((job) => (
                            <TableRow key={job.id}>
                                <TableCell className="py-3 text-gray-800 text-theme-sm dark:text-white/90">
                                    {job.title}
                                </TableCell>
                                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                    {job.category}
                                </TableCell>
                                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                    {job.budget}
                                </TableCell>
                                <TableCell className="py-3 text-theme-sm">
                                    <Badge
                                        size="sm"
                                        color={
                                            job.status === "Completed"
                                                ? "success"
                                                : job.status === "Ongoing"
                                                    ? "warning"
                                                    : "error"
                                        }
                                    >
                                        {job.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
