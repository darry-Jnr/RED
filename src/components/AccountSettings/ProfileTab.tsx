// src/components/AccountSettings/tabs/ProfileTab.tsx

import { useEffect, useState } from "react";
import { auth, db } from '../../firebase/firebaseConfig'
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

const ProfileTab = () => {
    const [user] = useAuthState(auth);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        bio: "",
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            const role = localStorage.getItem("role");
            const ref = doc(db, role!, user.uid);
            const snap = await getDoc(ref);
            if (snap.exists()) {
                const data = snap.data();
                setFormData({
                    fullName: data.fullName || "",
                    email: data.email || "",
                    phone: data.phone || "",
                    bio: data.bio || "",
                });
            }
        };
        fetchData();
    }, [user]);

    const handleChange = (e: any) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);
        const role = localStorage.getItem("role");
        const ref = doc(db, role!, user.uid);
        await updateDoc(ref, formData);
        alert("Profile updated!");
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>

            <input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full border p-2 rounded"
            />
            <input
                name="email"
                value={formData.email}
                disabled
                className="w-full border p-2 rounded bg-gray-100"
            />
            <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone"
                className="w-full border p-2 rounded"
            />
            <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Bio"
                className="w-full border p-2 rounded"
            />

            <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded"
                disabled={loading}
            >
                {loading ? "Saving..." : "Save Changes"}
            </button>
        </form>
    );
};

export default ProfileTab;
