import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { payWithPaystack } from "../../utils/paystack";
import { toast } from "react-toastify";
import { MdArrowBack } from "react-icons/md";

const EscrowPage = () => {
    const { jobId } = useParams<{ jobId: string }>();
    const navigate = useNavigate();
    const [budget, setBudget] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const jobRef = doc(db, "jobs", jobId!); // jobId is definitely defined
                const jobSnap = await getDoc(jobRef);

                if (jobSnap.exists()) {
                    const jobData = jobSnap.data();
                    if (jobData.budget) {
                        setBudget(Number(jobData.budget));
                    } else {
                        toast.error("No budget found for this job.");
                    }
                }
            } catch (error) {
                console.error("Error fetching job:", error);
                toast.error("Failed to load job info.");
            } finally {
                setLoading(false);
            }
        };

        if (jobId) fetchJob();
    }, [jobId]);

    const handlePayment = () => {
        if (!budget || !jobId) {
            toast.error("Missing budget or job ID");
            return;
        }

        payWithPaystack(budget, async (reference: string) => {
            try {
                await updateDoc(doc(db, "jobs", jobId), {
                    paid: true,
                    paymentRef: reference,
                });

                toast.success("Payment successful!");
                navigate(`/clients/messages/${jobId}?paid=true`);
            } catch (error) {
                console.error("Error updating payment status:", error);
                toast.error("Payment processed, but job status wasn't updated.");
            }
        });
    };

    if (loading) {
        return <p className="text-center mt-10 text-gray-600">Loading job details...</p>;
    }

    return (
        <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
            {/* 🔙 Back Button */}
            <button
                className="flex items-center text-blue-600 hover:underline mb-4"
                onClick={() => navigate(-1)}
            >
                <MdArrowBack className="text-xl mr-1" />
                Go Back
            </button>

            <h2 className="text-2xl font-bold mb-4">Escrow Payment for Your Job</h2>

            <p className="text-gray-700 mb-4">
                You're about to pay{" "}
                <span className="font-semibold text-black">₦{budget}</span>{" "}
                which will be held securely in escrow until the job is completed.
            </p>

            {/* What is Escrow */}
            <div className="mb-4">
                <h3 className="text-lg font-semibold mb-1">🔒 What is Escrow?</h3>
                <p className="text-gray-600 text-sm">
                    Escrow protects both clients and freelancers. Your funds are held securely and only released after you approve the completed job.
                </p>
            </div>

            {/* Why Pay Now */}
            <div className="mb-4">
                <h3 className="text-lg font-semibold mb-1">💸 Why Am I Paying Now?</h3>
                <p className="text-gray-600 text-sm">
                    This payment shows your commitment and secures the freelancer’s availability. Work starts only after escrow is funded.
                </p>
            </div>

            {/* What Happens After */}
            <div className="mb-4">
                <h3 className="text-lg font-semibold mb-1">✅ What Happens After Payment?</h3>
                <p className="text-gray-600 text-sm">
                    You’ll be redirected to the chat room. The freelancer will be notified and can begin working immediately.
                </p>
            </div>

            {/* Security Note */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-1">🛡️ Secure & Safe</h3>
                <p className="text-gray-600 text-sm">
                    All payments are processed via Paystack. Your funds remain safe until you confirm the work is complete.
                </p>
            </div>

            <div className="flex justify-between items-center mb-4">
                <span className="text-gray-700 font-medium">Amount to Pay:</span>
                <span className="text-black text-lg font-bold">₦{budget}</span>
            </div>

            <button
                onClick={handlePayment}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition-all"
            >
                Pay Now
            </button>

            <p className="text-xs text-gray-500 mt-3 text-center">
                By clicking “Pay Now”, you agree to hold the payment in escrow until the job is completed and approved.
            </p>
        </div>
    );
};

export default EscrowPage;
