import { useEffect, useState } from "react";
import { auth } from "../../firebase/firebaseConfig";
import { sendEmailVerification } from "firebase/auth";
import toast from "react-hot-toast";

export default function VerifyEmail() {
    const [resending, setResending] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const handleResend = async () => {
        if (!auth.currentUser) {
            toast.error("No user logged in.");
            return;
        }

        setResending(true);
        try {
            await sendEmailVerification(auth.currentUser);
            setEmailSent(true);
            toast.success("Verification email sent!");
        } catch (error: any) {
            console.error("Resend error:", error.message);
            toast.error("Failed to resend email.");
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="max-w-md mx-auto text-center py-20">
            <h2 className="text-2xl font-bold mb-4">Verify Your Email</h2>
            <p className="text-gray-600 mb-6">
                We've sent a verification link to your email. Please check your inbox and click the link to activate your account.
            </p>
            <p className="text-sm text-gray-400 mb-4">
                Didn't get the email? Check your spam folder or resend it below.
            </p>

            <button
                onClick={handleResend}
                disabled={resending}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
            >
                {resending ? "Resending..." : emailSent ? "Sent!" : "Resend Verification Link"}
            </button>
        </div>
    );
}
