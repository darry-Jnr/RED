// hooks/useAdminAuth.ts
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";

export default function useAdminAuth() {
    const [loading, setLoading] = useState(true);
    // Replace useRouter with useNavigate from react-router-dom
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                navigate("/admin"); // Redirect to admin login
                return;
            }

            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);
            const userData = userSnap.data();

            if (!userSnap.exists() || userData?.role !== "admin") {
                navigate("/"); // Or redirect elsewhere
            } else {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    return { loading };
}
