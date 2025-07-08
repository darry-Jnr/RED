export default function ClientJobSummaryCard() {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
                Job Overview
            </h3>
            <div className="space-y-4">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Jobs Posted</span>
                    <span className="font-semibold text-gray-800 dark:text-white/90">12</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Completed</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">8</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">In Progress</span>
                    <span className="font-semibold text-yellow-600 dark:text-yellow-400">3</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Cancelled</span>
                    <span className="font-semibold text-red-600 dark:text-red-400">1</span>
                </div>
            </div>
        </div>
    );
}
