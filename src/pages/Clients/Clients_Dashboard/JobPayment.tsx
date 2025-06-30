import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";

interface JobPaymentProps {
    jobId: string;
    amount: number;
}

const JobPayment = ({ jobId, amount }: JobPaymentProps) => {
    const navigate = useNavigate();

    const handleSuccessfulPayment = async (reference: string) => {
        try {
            const jobRef = doc(db, "jobs", jobId);
            await updateDoc(jobRef, {
                status: "live",
                isPaid: true,
                escrowAmount: amount,
                paystackRef: reference,
                updatedAt: new Date(),
            });

            console.log("✅ Firestore updated. Redirecting...");
            setTimeout(() => {
                navigate("/clients/payment-success");
            }, 500);
        } catch (err) {
            console.error("❌ Error updating Firestore:", err);
        }
    };

    const payWithPaystack = () => {
        const handler = (window as any).PaystackPop?.setup({
            key: "pk_test_93fb7906f7dc298cc521dabbe6f8d22ff9049cf7",
            email: "claudistore01@gmail.com",
            amount: amount * 100,
            currency: "NGN",
            ref: `${Date.now()}`,
            callback: function (response: any) {
                console.log("✅ Payment complete!", response);
                handleSuccessfulPayment(response.reference);
            },
            onClose: function () {
                console.log("❌ Payment window closed by user.");
            },
        });

        handler.openIframe();
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white text-center">
            <h1 className="text-xl font-bold mb-4">Fund Your Job</h1>
            <button
                onClick={payWithPaystack}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
                Pay ₦{amount.toLocaleString()}
            </button>
        </div>
    );
};

export default JobPayment;
