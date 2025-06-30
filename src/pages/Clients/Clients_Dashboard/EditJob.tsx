import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    doc,
    getDoc,
    updateDoc,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import toast from "react-hot-toast";
import PageMeta from "../../../components/common/PageMeta";

const EditJob = () => {
    const { id: jobId } = useParams(); // fixed route param
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [budget, setBudget] = useState("");

    useEffect(() => {
        const fetchJob = async () => {
            if (!jobId) return;

            const jobRef = doc(db, "jobs", jobId);
            const jobSnap = await getDoc(jobRef);

            if (jobSnap.exists()) {
                const jobData = jobSnap.data();

                // Prevent editing of paid or live jobs
                if (jobData.status !== "pending" || jobData.isPaid) {
                    toast.error("Cannot edit a job that is live or paid.");
                    setTimeout(() => {
                        navigate("/clients/my-jobs");
                    }, 1000);
                    return;
                }

                setTitle(jobData.title);
                setDescription(jobData.description);
                setBudget(jobData.budget?.toString());
            } else {
                toast.error("Job not found.");
                setTimeout(() => {
                    navigate("/clients/my-jobs");
                }, 1000);
            }
        };

        fetchJob();
    }, [jobId, navigate]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        const jobRef = doc(db, "jobs", jobId!);

        try {
            await updateDoc(jobRef, {
                title,
                description,
                budget: parseFloat(budget),
                updatedAt: serverTimestamp(),
            });

            toast.success("Job updated successfully!");
            navigate("/clients/my-jobs");
        } catch (error) {
            toast.error("Update failed.");
        }
    };

    return (
        <>
            <PageMeta title="Edit Job" description="Update your job posting." />
            <div className="max-w-2xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-4">Edit Job</h1>
                <form onSubmit={handleUpdate} className="space-y-4 bg-white p-6 rounded shadow">
                    <div>
                        <label className="block font-medium">Job Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full px-4 py-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block font-medium">Description</label>
                        <textarea
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            className="w-full px-4 py-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block font-medium">Budget (₦)</label>
                        <input
                            type="number"
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                            required
                            className="w-full px-4 py-2 border rounded"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                    >
                        Update Job
                    </button>
                </form>
            </div>
        </>
    );
};

export default EditJob;
