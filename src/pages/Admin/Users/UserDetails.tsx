import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import moment from "moment";

const UserDetails = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            if (!userId) return;

            try {
                const userRef = doc(db, "users", userId);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    setUser(userSnap.data());
                } else {
                    console.log("No such user!");
                }
            } catch (err) {
                console.error("Error fetching user:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId]);

    if (loading) return <div>Loading...</div>;
    if (!user) return <div>User not found.</div>;

    return (
        <div className="p-6">
            <button
                onClick={() => navigate(-1)}
                className="mb-4 text-blue-600 underline"
            >
                ← Back to users
            </button>

            <h2 className="text-2xl font-bold mb-4">User Details</h2>

            <div className="bg-white p-4 rounded shadow max-w-md">
                <p><strong>Full Name:</strong> {user.fullName}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Phone:</strong> {user.phone || "Not provided"}</p>
                <p><strong>Role:</strong> {user.role}</p>
                <p><strong>Date Joined:</strong> {moment(user.createdAt).format("LLL")}</p>
                <p><strong>Bio:</strong> {user.bio || "No bio yet"}</p>
            </div>
        </div>
    );
};

export default UserDetails;
