import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { toast } from "react-toastify";

// Define prop types
type Props = {
    // userId: string;
    jobId: string;
};

const EscrowFreelancer: React.FC<Props> = ({ jobId }) => {
    const [budget, setBudget] = useState("");
    const [paid, setPaid] = useState(false);

    const fetchJobInfo = async () => {
        try {
            const jobRef = doc(db, "jobs", jobId);
            const jobSnap = await getDoc(jobRef);

            if (jobSnap.exists()) {
                const job = jobSnap.data();
                setBudget(job.budget || "");
                setPaid(job.paid || false);
            }
        } catch (error) {
            console.error("Error fetching job:", error);
            toast.error("Failed to load budget info");
        }
    };

    useEffect(() => {
        fetchJobInfo();
    }, [jobId]);

    return (
        <div>
            {budget ? (
                <div
                    className={`px-2 py-1 text-sm rounded font-semibold ${paid ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-800"
                        }`}
                >
                    ₦{budget} {paid ? "(Paid)" : "(Unpaid)"}
                </div>
            ) : (
                <div className="text-sm text-gray-500 italic">Waiting for budget...</div>
            )}
        </div>
    );
};

export default EscrowFreelancer;
