export default function ClientTipCard() {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
            <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
                <div className="w-full">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                        💡 Daily Freelance Tip
                    </h3>
                    <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
                        Refresh your strategy daily to stay competitive in a growing market.
                    </p>
                </div>
                <div className="flex items-start w-full gap-3 sm:justify-end">
                    <button className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
                        View More
                    </button>
                </div>
            </div>

            <div className="max-w-full overflow-x-auto custom-scrollbar">
                <div className="min-w-[1000px] xl:min-w-full">
                    <p className="text-base text-gray-700 leading-relaxed dark:text-gray-300">
                        "Be specific in your job postings — the clearer your expectations, the better your outcome. Define deliverables, timelines, and required skills up front."
                    </p>
                </div>
            </div>
        </div>
    );
}
