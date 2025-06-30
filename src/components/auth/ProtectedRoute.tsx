// src/components/auth/ProtectedRoute.tsx
import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";

interface ProtectedRouteProps {
    children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setAuthenticated(true);
            } else {
                navigate("/signin", { replace: true }); // 👈 make sure `replace` is used to prevent back nav
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [navigate]);

    if (loading) return <div className="text-center py-20">Loading...</div>;

    return <>{authenticated && children}</>;
}
