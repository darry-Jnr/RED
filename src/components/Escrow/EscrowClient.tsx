import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { toast } from "react-toastify";
import { HiPencil } from "react-icons/hi";
import { MdOutlinePayment } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

// ✅ Define props
type Props = {
    userId: string;
    jobId: string;
};

const EscrowClient: React.FC<Props> = ({ jobId }) => {
    const [budget, setBudget] = useState("");
    const [paid, setPaid] = useState(false);
    const [editing, setEditing] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [isApproved, setIsApproved] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    // 🔄 Get updated job info
    const fetchJobData = async () => {
        try {
            const jobRef = doc(db, "jobs", jobId);
            const jobSnap = await getDoc(jobRef);

            if (jobSnap.exists()) {
                const job = jobSnap.data();
                setBudget(job.budget || "");
                setPaid(job.paid || false);
                setIsApproved(job.approved || false);
            }
        } catch (error) {
            console.error("Error fetching job data:", error);
            toast.error("Failed to load job info");
        }
    };

    // 💾 Save budget
    const handleSaveBudget = async () => {
        if (!inputValue.trim()) return;

        try {
            const jobRef = doc(db, "jobs", jobId);
            await updateDoc(jobRef, {
                budget: inputValue,
                paid: false,
                approved: false,
            });

            setBudget(inputValue);
            setEditing(false);
            setPaid(false);
            setIsApproved(false);
            toast.success("Budget set. Ready to pay.");
        } catch (error) {
            console.error("Error saving budget:", error);
            toast.error("Error saving budget.");
        }
    };

    // ✅ Approve freelancer
    const handleApproveClick = async () => {
        if (!paid) {
            toast.info("You must complete payment before approving.");
            return;
        }

        try {
            const jobRef = doc(db, "jobs", jobId);
            await updateDoc(jobRef, { approved: true });
            setIsApproved(true);
            toast.success("You have approved the freelancer.");
        } catch (error) {
            console.error("Error approving job:", error);
            toast.error("Error approving freelancer.");
        }
    };

    // 🧭 Navigate to payment page
    const handlePay = () => {
        navigate(`/clients/escrow/${jobId}`);
    };

    // 🚀 Auto-refresh when jobId or URL query changes
    useEffect(() => {
        fetchJobData();
    }, [jobId]);

    // 🚀 Detect if `?paid=true` was passed in URL after redirect
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get("paid") === "true") {
            fetchJobData();
        }
    }, [location]);

    return (
        <div className="flex items-center flex-wrap gap-3">
            {editing || !budget ? (
                <>
                    <input
                        type="number"
                        placeholder="Enter budget"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="px-2 py-1 text-sm border rounded-md w-28"
                    />
                    <button
                        onClick={handleSaveBudget}
                        className="px-2 py-1 text-sm text-white bg-gray-700 rounded"
                    >
                        Enter
                    </button>
                </>
            ) : (
                <>
                    <div
                        className={`px-2 py-1 text-sm rounded font-semibold ${paid
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-200 text-gray-800"
                            }`}
                    >
                        ₦{budget} {paid ? "(Paid)" : "(Unpaid)"}
                    </div>

                    {!paid && (
                        <>
                            <button onClick={() => setEditing(true)} title="Edit">
                                <HiPencil className="text-xl text-gray-600 hover:text-black" />
                            </button>
                            <button onClick={handlePay} title="Pay Now">
                                <MdOutlinePayment className="text-xl text-blue-600 hover:text-blue-800" />
                            </button>
                        </>
                    )}

                    {/* ✅ Approve Button */}
                    <div className="flex flex-col items-start">
                        <button
                            onClick={handleApproveClick}
                            disabled={isApproved}
                            className={`flex items-center px-3 py-1 text-sm rounded ${isApproved
                                ? "bg-green-100 text-green-600 cursor-not-allowed"
                                : "bg-yellow-500 hover:bg-yellow-600 text-white"
                                }`}
                        >
                            <FaCheckCircle className="mr-1" />
                            {isApproved ? "Approved" : "Approve"}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default EscrowClient;
