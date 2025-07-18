import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";

// Define interface
interface Project {
    id: number;
    title: string;
    client: string;
    category: string;
    budget: string;
    status: "Completed" | "In Progress" | "Canceled";
    image: string;
}

// Sample data
const projectData: Project[] = [
    {
        id: 1,
        title: "Portfolio Website",
        client: "Jane Doe",
        category: "Web Development",
        budget: "₦350,000",
        status: "Completed",
        image: "/images/avatar/avatar-01.jpg",
    },
    {
        id: 2,
        title: "Logo Design for Startup",
        client: "Lagos Fintech",
        category: "Graphic Design",
        budget: "₦85,000",
        status: "In Progress",
        image: "/images/avatar/avatar-02.jpg",
    },
    {
        id: 3,
        title: "Mobile App UI/UX",
        client: "TechHive",
        category: "UI/UX Design",
        budget: "₦180,000",
        status: "Completed",
        image: "/images/avatar/avatar-03.jpg",
    },
    {
        id: 4,
        title: "Social Media Management",
        client: "Foodiez NG",
        category: "Marketing",
        budget: "₦120,000",
        status: "Canceled",
        image: "/images/avatar/avatar-04.jpg",
    },
];

export default function RecentProjects() {
    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
            <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                    Recent Projects
                </h3>
                <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
                    See all
                </button>
            </div>

            <div className="max-w-full overflow-x-auto">
                <Table>
                    <TableHeader className="border-y border-gray-100 dark:border-gray-800">
                        <TableRow>
                            <TableCell isHeader className="text-start text-theme-xs text-gray-500 dark:text-gray-400 py-3">
                                Project
                            </TableCell>
                            <TableCell isHeader className="text-start text-theme-xs text-gray-500 dark:text-gray-400 py-3">
                                Client
                            </TableCell>
                            <TableCell isHeader className="text-start text-theme-xs text-gray-500 dark:text-gray-400 py-3">
                                Category
                            </TableCell>
                            <TableCell isHeader className="text-start text-theme-xs text-gray-500 dark:text-gray-400 py-3">
                                Budget
                            </TableCell>
                            <TableCell isHeader className="text-start text-theme-xs text-gray-500 dark:text-gray-400 py-3">
                                Status
                            </TableCell>
                        </TableRow>
                    </TableHeader>

                    <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {projectData.map((project) => (
                            <TableRow key={project.id}>
                                <TableCell className="py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="h-[40px] w-[40px] rounded-full overflow-hidden">
                                            <img src={project.image} alt={project.client} />
                                        </div>
                                        <div>
                                            <p className="text-theme-sm font-medium text-gray-800 dark:text-white/90">
                                                {project.title}
                                            </p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="py-3 text-gray-500 dark:text-gray-400 text-theme-sm">
                                    {project.client}
                                </TableCell>
                                <TableCell className="py-3 text-gray-500 dark:text-gray-400 text-theme-sm">
                                    {project.category}
                                </TableCell>
                                <TableCell className="py-3 text-gray-500 dark:text-gray-400 text-theme-sm">
                                    {project.budget}
                                </TableCell>
                                <TableCell className="py-3">
                                    <Badge
                                        size="sm"
                                        color={
                                            project.status === "Completed"
                                                ? "success"
                                                : project.status === "In Progress"
                                                    ? "warning"
                                                    : "error"
                                        }
                                    >
                                        {project.status}
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
