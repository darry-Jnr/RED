import { useLocation, useParams } from "react-router-dom";
import JobPayment from "./JobPayment";

const JobPaymentWrapper = () => {
    const location = useLocation();
    const { jobId } = useParams();
    const { amount } = location.state || {};

    console.log("🧪 jobId:", jobId);
    console.log("🧪 amount:", amount, typeof amount);

    if (!jobId || typeof amount !== "number" || isNaN(amount)) {
        return (
            <div className="text-center text-red-600 mt-20">
                Invalid payment information provided.
            </div>
        );
    }

    return <JobPayment jobId={jobId} amount={amount} />;
};

export default JobPaymentWrapper;
