import PageMeta from "../../components/common/PageMeta";
import AdminMetrics from "../../components/admin/AdminMetrics";
import useAdminAuth from "../../hooks/useAdminAuth"; // ✅ Correct import

export default function AdminDashboard() {
    const { loading } = useAdminAuth(); // ✅ Use admin auth hook

    if (loading) {
        return (
            <div className="w-full flex justify-center items-center h-screen">
                <div className="flex flex-col items-center gap-3">
                    <svg
                        className="animate-spin h-8 w-8 text-blue-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8H4z"
                        ></path>
                    </svg>
                    <p className="text-lg font-medium text-gray-700">Checking admin access...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <PageMeta
                title="Red | Admin Dashboard"
                description="Manage your job posts, messages, and profile as an admin on Red."
            />

            <div className="w-full px-4 md:px-6 py-4">
                <div className="grid grid-cols-12 gap-4 md:gap-6">
                    <div className="col-span-12">
                        <AdminMetrics />
                    </div>
                </div>
            </div>
        </>
    );
}
