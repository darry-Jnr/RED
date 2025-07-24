import { useEffect, useState } from "react";
import { db, auth } from "../../../../firebase/firebaseConfig";
import {
    collection,
    query,
    where,
    getDocs,
    Timestamp,
    orderBy,
} from "firebase/firestore";
import WithdrawModal from "./WithdrawModal";

interface Withdrawal {
    id: string;
    amount: number;
    account: string;
    status: string;
    createdAt: Timestamp;
    fee: number;
}

export default function WithdrawalsPage() {
    const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
    const [totalEarnings, setTotalEarnings] = useState(5000); // Fake for now
    const withdrawalFee = 25;
    const [showModal, setShowModal] = useState(false);

    const withdrawable = totalEarnings - withdrawalFee;

    useEffect(() => {
        const fetchWithdrawals = async () => {
            if (!auth.currentUser?.uid) return;
            const q = query(
                collection(db, "withdrawals"),
                where("userId", "==", auth.currentUser.uid),
                orderBy("createdAt", "desc")
            );
            const snapshot = await getDocs(q);
            const data: Withdrawal[] = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...(doc.data() as Withdrawal),
            }));
            setWithdrawals(data);
        };

        fetchWithdrawals();
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Withdraw Earnings</h1>

            <div className="bg-white rounded-xl p-6 shadow mb-8">
                <p className="text-gray-700 mb-2">Total Available:</p>
                <h2 className="text-3xl font-bold text-green-600 mb-4">
                    ₦{totalEarnings.toLocaleString()}
                </h2>

                <button
                    onClick={() => setShowModal(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl transition"
                >
                    Withdraw ₦{withdrawable.toLocaleString()}
                </button>
                <p className="text-sm text-gray-500 mt-2">
                    A ₦{withdrawalFee} processing fee will be applied.
                </p>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Withdrawal History</h3>
                {withdrawals.length === 0 ? (
                    <p className="text-gray-500">No withdrawals yet.</p>
                ) : (
                    <ul className="space-y-4">
                        {withdrawals.map((w) => (
                            <li key={w.id} className="flex justify-between items-center">
                                <div>
                                    <p className="text-gray-700 font-medium">
                                        ₦{w.amount.toLocaleString()} to {w.account}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {w.status} • {w.createdAt.toDate().toLocaleString()}
                                    </p>
                                </div>
                                <span
                                    className={`px-3 py-1 text-sm rounded-xl ${w.status === "pending"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-green-100 text-green-700"
                                        }`}
                                >
                                    {w.status}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {showModal && (
                <WithdrawModal
                    onClose={() => setShowModal(false)}
                    withdrawable={totalEarnings}
                    withdrawalFee={withdrawalFee}
                />
            )}
        </div>
    );
}
