// src/components/AccountSettings/SettingsForm.tsx

import { useEffect, useState } from "react";
import { auth, db } from "../../firebase/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

export default function SettingsForm() {
    const [user] = useAuthState(auth);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        bio: "",
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUserInfo = async () => {
            if (!user) return;

            const role = localStorage.getItem("role"); // 'clients' or 'freelancers'
            const docRef = doc(db, role, user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                setFormData({
                    fullName: data.fullName || "",
                    email: data.email || "",
                    phone: data.phone || "",
                    bio: data.bio || "",
                });
            }
        };

        fetchUserInfo();
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        try {
            setLoading(true);
            const role = localStorage.getItem("role");
            const docRef = doc(db, role, user.uid);
            await updateDoc(docRef, formData);
            alert("Account info updated!");
        } catch (error) {
            console.error("Update error:", error);
            alert("Error updating profile.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium">Full Name</label>
                <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="w-full border rounded p-2 bg-gray-100"
                />
            </div>

            <div>
                <label className="block text-sm font-medium">Phone</label>
                <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                />
            </div>

            <div>
                <label className="block text-sm font-medium">Bio</label>
                <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                    rows={4}
                />
            </div>

            <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded"
                disabled={loading}
            >
                {loading ? "Saving..." : "Save Changes"}
            </button>
        </form>
    );
}
