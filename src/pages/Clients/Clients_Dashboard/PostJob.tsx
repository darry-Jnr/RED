import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../../../firebase/firebaseConfig";
import PageMeta from "../../../components/common/PageMeta";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const PostJob = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [budget, setBudget] = useState("");

    const navigate = useNavigate();

    const handlePostJob = async (e: React.FormEvent) => {
        e.preventDefault();

        const user = auth.currentUser;
        if (!user) return toast.error("You must be logged in to post a job.");

        const budgetNumber = parseFloat(budget);

        if (isNaN(budgetNumber) || budgetNumber <= 0) {
            return toast.error("Please enter a valid budget amount.");
        }

        try {
            const docRef = await addDoc(collection(db, "jobs"), {
                title,
                description,
                budget: budgetNumber,
                clientId: user.uid,
                status: "pending",
                isPaid: false,
                createdAt: serverTimestamp(),
            });

            toast.success("Job saved! Redirecting to payment...");

            // Reset form
            setTitle("");
            setDescription("");
            setBudget("");

            // Redirect to payment page for ₦100
            navigate(`/clients/payment/${docRef.id}`, {
                state: { amount: 100 },
            });
        } catch (error) {
            console.error("❌ Error posting job:", error);
            toast.error("Failed to post job.");
        }
    };

    return (
        <>
            <PageMeta title="Red | Post a Job" description="Post freelance tasks." />
            <div className="p-6 max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold text-[#003152] mb-4">Post a New Job</h1>
                <form
                    onSubmit={handlePostJob}
                    className="bg-white shadow-md rounded-lg p-6"
                >
                    <div className="mb-4">
                        <label className="block font-medium text-gray-700 mb-1">
                            Job Title
                        </label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            type="text"
                            required
                            className="w-full px-4 py-2 border rounded-md"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            rows={4}
                            className="w-full px-4 py-2 border rounded-md"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block font-medium text-gray-700 mb-1">
                            Budget (₦)
                        </label>
                        <input
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                            type="number"
                            required
                            className="w-full px-4 py-2 border rounded-md"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                    >
                        Post Job
                    </button>
                </form>
            </div>
        </>
    );
};

export default PostJob;
