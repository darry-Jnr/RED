import { useEffect, useState } from "react";
import { db } from "../../firebase/firebaseConfig";
import {
    collection,
    getDocs,
    updateDoc,
    doc,
    query,
    where,
} from "firebase/firestore";
import moment from "moment";

const ReleasePayments = () => {
    const [escrows, setEscrows] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchEscrowPayments = async () => {
        const q = query(
            collection(db, "escrows"),
            where("status", "==", "escrow_paid")
        );
        const snapshot = await getDocs(q);
        const list = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        setEscrows(list);
        setLoading(false);
    };

    const markAsReleased = async (id: string) => {
        await updateDoc(doc(db, "escrows", id), {
            status: "released_to_freelancer",
            releasedAt: new Date(),
        });
        fetchEscrowPayments(); // Refresh
    };

    useEffect(() => {
        fetchEscrowPayments();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-xl font-bold mb-4">Release Payments to Freelancers</h1>
            {loading ? (
                <p>Loading...</p>
            ) : escrows.length === 0 ? (
                <p>No pending payments.</p>
            ) : (
                <table className="w-full text-sm border">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 border">Job Title</th>
                            <th className="p-2 border">Client</th>
                            <th className="p-2 border">Freelancer</th>
                            <th className="p-2 border">Amount</th>
                            <th className="p-2 border">Bank Details</th>
                            <th className="p-2 border">Date Paid</th>
                            <th className="p-2 border">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {escrows.map((e) => (
                            <tr key={e.id} className="border-t">
                                <td className="p-2 border">{e.jobTitle || "—"}</td>
                                <td className="p-2 border">{e.clientName || "—"}</td>
                                <td className="p-2 border">{e.freelancerName || "—"}</td>
                                <td className="p-2 border">₦{e.amount || 0}</td>
                                <td className="p-2 border">
                                    <div className="text-sm font-medium">
                                        {e.freelancerBankName || "No Bank"}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {e.freelancerAccountNumber || "No Account"}
                                    </div>
                                </td>
                                <td className="p-2 border">
                                    {e.createdAt?.toDate
                                        ? moment(e.createdAt.toDate()).format("lll")
                                        : "—"}
                                </td>
                                <td className="p-2 border">
                                    <button
                                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-xs rounded"
                                        onClick={() => markAsReleased(e.id)}
                                    >
                                        Mark as Sent
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ReleasePayments;
