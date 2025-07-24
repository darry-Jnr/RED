import { useEffect, useState } from "react";
import { collection, getDocs, query, where, updateDoc, doc } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import moment from "moment";
import { FaUserSlash, FaCheckCircle } from "react-icons/fa";
import { MdVerifiedUser } from "react-icons/md";
import { useNavigate } from "react-router-dom";

interface User {
    id: string;
    email: string;
    createdAt: any;
    role: "client" | "freelancer";
    firstName?: string;
    lastName?: string;
    isSuspended?: boolean;
    emailVerified?: boolean;
    profileComplete?: boolean;
}

const Users = () => {
    const navigate = useNavigate();
    const [clients, setClients] = useState<User[]>([]);
    const [freelancers, setFreelancers] = useState<User[]>([]);
    const [search, setSearch] = useState("");
    const [sortNewest, setSortNewest] = useState(true);
    const [filterVerified, setFilterVerified] = useState(false);
    const [filterCompleted, setFilterCompleted] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            const usersRef = collection(db, "users");

            const clientQuery = query(usersRef, where("role", "==", "client"));
            const freelancerQuery = query(usersRef, where("role", "==", "freelancer"));

            const [clientSnap, freelancerSnap] = await Promise.all([
                getDocs(clientQuery),
                getDocs(freelancerQuery),
            ]);

            const clientsData = clientSnap.docs.map((doc) => ({
                id: doc.id,
                ...(doc.data() as User),
            }));

            const freelancersData = freelancerSnap.docs.map((doc) => ({
                id: doc.id,
                ...(doc.data() as User),
            }));

            setClients(clientsData);
            setFreelancers(freelancersData);
        };

        fetchUsers();
    }, []);

    const handleSuspendToggle = async (userId: string, currentStatus: boolean) => {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, { isSuspended: !currentStatus });

        setClients((prev) =>
            prev.map((u) => (u.id === userId ? { ...u, isSuspended: !currentStatus } : u))
        );
        setFreelancers((prev) =>
            prev.map((u) => (u.id === userId ? { ...u, isSuspended: !currentStatus } : u))
        );
    };

    const applyFiltersAndSort = (users: User[]) => {
        let filtered = users.filter((user) => {
            const fullName = `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase();
            return fullName.includes(search.toLowerCase());
        });

        if (filterVerified) {
            filtered = filtered.filter((u) => u.emailVerified);
        }

        if (filterCompleted) {
            filtered = filtered.filter((u) => u.profileComplete);
        }

        return filtered.sort((a, b) =>
            sortNewest
                ? b.createdAt?.toDate?.() - a.createdAt?.toDate?.()
                : a.createdAt?.toDate?.() - b.createdAt?.toDate?.()
        );
    };

    const renderTable = (users: User[], title: string) => (
        <div className="mb-10">
            <h3 className="text-lg font-semibold mb-2">
                {title} ({users.length})
            </h3>
            <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-100 dark:bg-gray-800">
                        <tr>
                            <th className="px-4 py-2 text-left">Full Name</th>
                            <th className="px-4 py-2 text-left">Email</th>
                            <th className="px-4 py-2 text-left">Join Date</th>
                            <th className="px-4 py-2 text-left">Status</th>
                            <th className="px-4 py-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-black/20 divide-y dark:divide-gray-800">
                        {users.map((user) => {
                            const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
                            return (
                                <tr key={user.id}>
                                    <td className="px-4 py-2">{fullName || "N/A"}</td>
                                    <td className="px-4 py-2">{user.email}</td>
                                    <td className="px-4 py-2">
                                        {moment(user.createdAt?.toDate?.()).format("ll")}
                                    </td>
                                    <td className="px-4 py-2 flex items-center gap-2">
                                        {user.emailVerified && (
                                            <MdVerifiedUser title="Email Verified" className="text-green-500" />
                                        )}
                                        {user.profileComplete && (
                                            <FaCheckCircle title="Profile Complete" className="text-blue-500" />
                                        )}
                                        {user.isSuspended && (
                                            <span className="text-red-500 font-semibold text-sm">Suspended</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-2 flex gap-2 items-center">
                                        <button
                                            onClick={() => navigate(`/admin/users/${user.id}`)}
                                            className="text-blue-500 underline"
                                        >
                                            View
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleSuspendToggle(user.id, user.isSuspended ?? false)
                                            }
                                            className={`text-sm flex items-center gap-1 ${user.isSuspended ? "text-green-600" : "text-red-600"
                                                } hover:underline`}
                                        >
                                            <FaUserSlash />
                                            {user.isSuspended ? "Unban" : "Suspend"}
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">All Users</h2>

            <div className="mb-4 flex flex-wrap gap-4">
                <input
                    type="text"
                    placeholder="Search by name..."
                    className="px-4 py-2 border rounded-md w-full max-w-sm dark:bg-white/5 dark:text-white"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={sortNewest}
                        onChange={() => setSortNewest((prev) => !prev)}
                    />
                    Sort by Newest
                </label>

                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={filterVerified}
                        onChange={() => setFilterVerified((prev) => !prev)}
                    />
                    Verified Email
                </label>

                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={filterCompleted}
                        onChange={() => setFilterCompleted((prev) => !prev)}
                    />
                    Profile Complete
                </label>
            </div>

            {renderTable(applyFiltersAndSort(clients), "Clients")}
            {renderTable(applyFiltersAndSort(freelancers), "Freelancers")}
        </div>
    );
};

export default Users;
