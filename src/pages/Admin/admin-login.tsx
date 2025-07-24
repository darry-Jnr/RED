import { useState, useEffect } from "react";
import {
    signInWithEmailAndPassword,
    setPersistence,
    browserSessionPersistence,
    signOut,
} from "firebase/auth";
import { auth, db } from "../../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // SIGN OUT ON MOUNT TO FORCE RELOGIN
    useEffect(() => {
        signOut(auth).catch(console.error);
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // Force session to be temporary for tab only
            await setPersistence(auth, browserSessionPersistence);

            const userCred = await signInWithEmailAndPassword(auth, email, password);
            const user = userCred.user;

            // Check admin role in Firestore
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists() || userSnap.data().role !== "admin") {
                setError("Access denied. You are not an admin.");
                return;
            }

            navigate("/admin-dashboard");
        } catch (err: any) {
            setError("Login failed. Check credentials.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <form
                onSubmit={handleLogin}
                className="w-full max-w-md bg-white p-6 rounded shadow"
            >
                <h2 className="text-2xl font-semibold mb-4 text-center">Admin Login</h2>
                {error && <p className="text-red-600 mb-2">{error}</p>}
                <input
                    type="email"
                    placeholder="Admin Email"
                    className="w-full mb-3 p-2 border rounded"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full mb-4 p-2 border rounded"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded"
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
}
