import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { db, auth } from "../../../../firebase/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

interface WithdrawModalProps {
    onClose: () => void;
    withdrawable: number;
    withdrawalFee: number;
}

export default function WithdrawModal({ onClose, withdrawable, withdrawalFee }: WithdrawModalProps) {
    const [amount, setAmount] = useState("");
    const [account, setAccount] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const numericAmount = parseFloat(amount);
        if (!numericAmount || numericAmount <= 0) {
            return setError("Enter a valid amount.");
        }

        if (numericAmount + withdrawalFee > withdrawable) {
            return setError("Amount exceeds available balance.");
        }

        if (!account || account.length < 10) {
            return setError("Enter a valid bank account.");
        }

        try {
            setLoading(true);

            await addDoc(collection(db, "withdrawals"), {
                userId: auth.currentUser?.uid,
                amount: numericAmount,
                account,
                status: "pending",
                createdAt: serverTimestamp(),
                fee: withdrawalFee,
            });

            setLoading(false);
            onClose();
            alert("Withdrawal request submitted!");
        } catch (err) {
            setError("Something went wrong. Try again.");
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white p-6 rounded-2xl w-[90%] max-w-md shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Request Withdrawal</h2>
                    <button onClick={onClose}>
                        <FaTimes className="text-gray-500" />
                    </button>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Amount (₦)</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Enter amount to withdraw"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Bank Account</label>
                        <input
                            type="text"
                            value={account}
                            onChange={(e) => setAccount(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="e.g. 0123456789 - GTBank"
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl transition disabled:opacity-50"
                    >
                        {loading ? "Submitting..." : `Submit Request (₦${withdrawalFee} fee)`}
                    </button>
                </form>
            </div>
        </div>
    );
}
