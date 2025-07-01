// pages/Auth/ChooseDashboard.tsx

import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import toast from "react-hot-toast";

export default function ChooseDashboard() {
    const navigate = useNavigate();
    const uid = localStorage.getItem("uid");

    const handleChoose = async (role: "client" | "freelancer") => {
        if (!uid) {
            toast.error("Session expired. Please sign in again.");
            return navigate("/signin");
        }

        const ref = doc(db, role === "client" ? "users" : "freelancers", uid);
        const docSnap = await getDoc(ref);

        if (docSnap.exists()) {
            toast.success(`Logged in as ${role}`);
            navigate(role === "client" ? "/clients" : "/freelancer");
        } else {
            toast.error(`${role} account not found`);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Choose Your Dashboard</h1>

            <div className="space-y-4 w-full max-w-xs">
                <button
                    onClick={() => handleChoose("client")}
                    className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
                >
                    Continue as Client
                </button>
                <button
                    onClick={() => handleChoose("freelancer")}
                    className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition"
                >
                    Continue as Freelancer
                </button>
            </div>
        </div>
    );
}
