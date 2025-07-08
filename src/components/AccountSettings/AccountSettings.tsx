// src/components/AccountSettings/AccountSettings.tsx

import { useState } from "react";
import Sidebar from "./Sidebar";
import ProfileTab from "./ProfileTab";
import ChangePasswordTab from "./ChangePasswordTab";

const AccountSettings = () => {
    const [activeTab, setActiveTab] = useState("profile");

    const renderTab = () => {
        switch (activeTab) {
            case "profile":
                return <ProfileTab />;
            case "password":
                return <ChangePasswordTab />;
            default:
                return <ProfileTab />;
        }
    };

    return (
        <div className="flex flex-col md:flex-row max-w-5xl mx-auto min-h-screen p-6 gap-6">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="flex-1 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                {renderTab()}
            </div>
        </div>
    );
};

export default AccountSettings;
