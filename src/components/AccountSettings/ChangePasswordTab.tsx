// src/components/AccountSettings/tabs/ChangePasswordTab.tsx

const ChangePasswordTab = () => {
    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Change Password</h2>
            <form className="space-y-4">
                <input
                    type="password"
                    placeholder="Current Password"
                    className="w-full border p-2 rounded"
                />
                <input
                    type="password"
                    placeholder="New Password"
                    className="w-full border p-2 rounded"
                />
                <input
                    type="password"
                    placeholder="Confirm New Password"
                    className="w-full border p-2 rounded"
                />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                    Update Password
                </button>
            </form>
        </div>
    );
};

export default ChangePasswordTab;
