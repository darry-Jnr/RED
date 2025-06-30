import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

const PaymentSuccess = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white text-center px-6">
            <FaCheckCircle className="text-green-600 text-6xl mb-4" />
            <h1 className="text-2xl font-bold mb-2 text-green-700">Payment Successful</h1>
            <p className="text-gray-600 mb-6">
                Your job has been funded and is now live for freelancers to apply.
            </p>
            <Link
                to="/clients"
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
                Go to Dashboard
            </Link>
        </div>
    );
};

export default PaymentSuccess;
