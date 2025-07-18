import { FaWallet } from "react-icons/fa";

const EarningsThisMonthCard = () => {
    const earningsThisMonth = 42000;
    const lastMonthEarnings = 35000;

    const difference = earningsThisMonth - lastMonthEarnings;
    const percentChange = ((difference / lastMonthEarnings) * 100).toFixed(1);
    const isPositive = difference >= 0;

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6 w-full flex flex-col justify-between gap-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                        Earnings This Month
                    </h2>
                    <p className="text-2xl font-bold text-green-600 mt-1">
                        ₦{earningsThisMonth.toLocaleString()}
                    </p>
                </div>

                <div className="text-green-500 bg-green-100 dark:bg-green-900 dark:text-green-300 p-4 rounded-full text-2xl">
                    <FaWallet />
                </div>
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-300">
                <p>
                    Last month: <span className="font-medium">₦{lastMonthEarnings.toLocaleString()}</span>
                </p>
                <p className={isPositive ? "text-green-500" : "text-red-500"}>
                    {isPositive ? "▲" : "▼"} {percentChange}% {isPositive ? "increase" : "decrease"} compared to last month.
                </p>
                <p className="mt-1">
                    Keep up the good work! Consistent delivery and strong client ratings can help you earn even more next month.
                </p>
            </div>
        </div>
    );
};

export default EarningsThisMonthCard;
