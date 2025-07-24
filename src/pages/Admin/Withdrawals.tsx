// src/pages/Admin/Withdrawals.tsx
import { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import moment from "moment";

const Withdrawals = () => {
    const [withdrawals, setWithdrawals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchWithdrawals = async () => {
        try {
            const snapshot = await getDocs(collection(db, "withdrawals"));
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setWithdrawals(data);
        } catch (error) {
            console.error("Error fetching withdrawals:", error);
        } finally {
            setLoading(false);
        }
    };

    const markAsPaid = async (withdrawalId: string) => {
        try {
            const withdrawalRef = doc(db, "withdrawals", withdrawalId);
            await updateDoc(withdrawalRef, { status: "paid" });
            fetchWithdrawals(); // Refresh
        } catch (err) {
            console.error("Error updating status:", err);
        }
    };

    useEffect(() => {
        fetchWithdrawals();
    }, []);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Withdrawals</h2>
            {loading ? (
                <p>Loading...</p>
            ) : withdrawals.length === 0 ? (
                <p>No withdrawals found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 shadow">
                        <thead className="bg-gray-100 text-gray-700 text-sm">
                            <tr>
                                <th className="py-2 px-4 border">User</th>
                                <th className="py-2 px-4 border">Role</th>
                                <th className="py-2 px-4 border">Amount</th>
                                <th className="py-2 px-4 border">Date</th>
                                <th className="py-2 px-4 border">Status</th>
                                <th className="py-2 px-4 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {withdrawals.map((w) => (
                                <tr key={w.id} className="text-sm">
                                    <td className="py-2 px-4 border">{w.fullName || "N/A"}</td>
                                    <td className="py-2 px-4 border capitalize">{w.role}</td>
                                    <td className="py-2 px-4 border">₦{w.amount}</td>
                                    <td className="py-2 px-4 border">
                                        {w.createdAt
                                            ? moment(w.createdAt.toDate?.() || w.createdAt).format("lll")
                                            : "N/A"}
                                    </td>
                                    <td className="py-2 px-4 border">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs ${w.status === "paid"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-yellow-100 text-yellow-700"
                                                }`}
                                        >
                                            {w.status || "pending"}
                                        </span>
                                    </td>
                                    <td className="py-2 px-4 border">
                                        {w.status !== "paid" && (
                                            <button
                                                onClick={() => markAsPaid(w.id)}
                                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                                            >
                                                Mark as Paid
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Withdrawals;
