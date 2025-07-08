// src/components/AccountSettings/Sidebar.tsx

type Props = {
    activeTab: string;
    setActiveTab: (tab: string) => void;
};

const Sidebar = ({ activeTab, setActiveTab }: Props) => {
    const tabs = [
        { id: "profile", label: "Edit Profile" },
        { id: "password", label: "Change Password" },
        // { id: "notifications", label: "Notifications" },
        // { id: "delete", label: "Delete Account" },
    ];

    return (
        <div className="w-full md:w-1/3 bg-white dark:bg-gray-900 rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4">Settings</h2>
            <ul className="space-y-3">
                {tabs.map((tab) => (
                    <li
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`cursor-pointer px-4 py-2 rounded-lg 
              ${activeTab === tab.id
                                ? "bg-blue-600 text-white"
                                : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                            }`}
                    >
                        {tab.label}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;
