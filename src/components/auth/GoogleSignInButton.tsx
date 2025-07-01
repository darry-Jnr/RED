import { signInWithPopup, signOut } from "firebase/auth";
import { auth, db, googleProvider } from "../../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function GoogleSignInButton() {
    const navigate = useNavigate();

    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            const uid = user.uid;

            const clientRef = doc(db, "users", uid);
            const freelancerRef = doc(db, "freelancers", uid);

            const [clientSnap, freelancerSnap] = await Promise.all([
                getDoc(clientRef),
                getDoc(freelancerRef),
            ]);

            localStorage.setItem("uid", uid);
            localStorage.setItem("email", user.email || "");

            const isClient = clientSnap.exists();
            const isFreelancer = freelancerSnap.exists();

            if (isClient && isFreelancer) {
                toast.success("Account found for both roles.");
                return navigate("/choose-dashboard");
            }

            if (isClient) {
                localStorage.setItem("role", "client");
                toast.success("Signed in as client!");
                return navigate("/clients");
            }

            if (isFreelancer) {
                localStorage.setItem("role", "freelancer");
                toast.success("Signed in as freelancer!");
                return navigate("/freelancer");
            }

            // No account found
            toast.error("No account found. Please sign up first.");
            await signOut(auth);

        } catch (error: any) {
            console.error("Google Sign-In Error:", error.message);
            toast.error("Google Sign-In failed: " + error.message);
        }
    };

    return (
        <button
            type="button"
            onClick={handleGoogleSignIn}
            className="flex items-center justify-center gap-3 w-full py-3 px-7 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10"
        >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path fill="#4285F4" d="M18.75 10.19c0-.72-.06-1.25-.19-1.79H10v3.28h5.1c-.11.72-.44 1.57-1.08 2.13v1.77h1.74C17.78 15.1 18.75 12.86 18.75 10.19Z" />
                <path fill="#34A853" d="M10 18.75c2.42 0 4.45-.8 5.93-2.17l-2.84-2.18c-.78.52-1.78.83-3.09.83-2.38 0-4.4-1.6-5.13-3.75H2v2.34A8.74 8.74 0 0 0 10 18.75Z" />
                <path fill="#FBBC05" d="M4.88 10.47a5.26 5.26 0 0 1 0-3.29V4.84H2A8.76 8.76 0 0 0 1.25 10c0 1.39.33 2.7.92 3.87l2.71-2.1Z" />
                <path fill="#EA4335" d="M10 3.58c1.32 0 2.35.45 3.09 1.34l2.31-2.3C14.44 1.36 12.42.63 10 .63 6.5.63 3.52 2.57 2 5.46l2.75 2.18C5.6 5.19 7.62 3.58 10 3.58Z" />
            </svg>
            Sign in with Google
        </button>
    );
}
