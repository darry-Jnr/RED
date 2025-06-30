import { useEffect, useState } from "react";
import {
    collection,
    getDocs,
    query,
    where,
    deleteDoc,
    doc,
} from "firebase/firestore";
import { db, auth } from "../../../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import PageMeta from "../../../components/common/PageMeta";
import toast from "react-hot-toast";

dayjs.extend(relativeTime);

const MyJobs = () => {
    const [jobs, setJobs] = useState<any[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchClientJobs = async () => {
            const user = auth.currentUser;
            if (!user) return;

            const jobsRef = collection(db, "jobs");
            const q = query(jobsRef, where("clientId", "==", user.uid));
            const snapshot = await getDocs(q);
            const jobList = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setJobs(jobList);
        };

        fetchClientJobs();
    }, []);

    const handleFundJob = (jobId: string, amount: number) => {
        navigate(`/clients/payment/${jobId}`, {
            state: { amount },
        });
    };

    const handleDeleteJob = async (jobId: string) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this job?");
        if (!confirmDelete) return;

        try {
            await deleteDoc(doc(db, "jobs", jobId));
            setJobs((prev) => prev.filter((job) => job.id !== jobId));
            toast.success("Job deleted.");
        } catch (err) {
            toast.error("Failed to delete job.");
        }
    };

    return (
        <>
            <PageMeta title="Red | My Jobs" description="Manage your job posts." />
            <div className="max-w-5xl mx-auto p-6">
                <h1 className="text-2xl font-bold text-[#003152] mb-4">My Jobs</h1>

                {jobs.length === 0 ? (
                    <p className="text-gray-600">You haven’t posted any jobs yet.</p>
                ) : (
                    <div className="space-y-4">
                        {jobs.map((job) => (
                            <div
                                key={job.id}
                                className="p-4 bg-white rounded-md shadow border"
                            >
                                <h2 className="text-lg font-semibold">{job.title}</h2>
                                <p className="text-gray-700 mt-1">{job.description}</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    Budget: ₦{job.budget?.toLocaleString()} • Posted{" "}
                                    {dayjs(job.createdAt?.toDate()).fromNow()}
                                </p>

                                <div className="mt-2 flex flex-wrap gap-4 text-sm">
                                    <span
                                        className={`px-3 py-1 rounded-full font-medium ${job.status === "live"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-yellow-100 text-yellow-700"
                                            }`}
                                    >
                                        Status: {job.status}
                                    </span>

                                    <span
                                        className={`px-3 py-1 rounded-full font-medium ${job.isPaid
                                            ? "bg-blue-100 text-blue-700"
                                            : "bg-red-100 text-red-700"
                                            }`}
                                    >
                                        {job.isPaid ? "Paid" : "Not Paid"}
                                    </span>
                                </div>

                                <div className="mt-4 flex flex-wrap gap-4">
                                    {!job.isPaid && (
                                        <button
                                            onClick={() => handleFundJob(job.id, job.budget || 100)}
                                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                                        >
                                            Pay ₦{job.budget?.toLocaleString()} to Go Live
                                        </button>
                                    )}

                                    {job.status === "pending" && (
                                        <button
                                            onClick={() => navigate(`/clients/edit-job/${job.id}`)}
                                            className="bg-blue-100 text-blue-700 px-4 py-2 rounded hover:bg-blue-200 text-sm"
                                        >
                                            ✏️ Edit
                                        </button>
                                    )}

                                    <button
                                        onClick={() => handleDeleteJob(job.id)}
                                        className="bg-red-100 text-red-700 px-4 py-2 rounded hover:bg-red-200 text-sm"
                                    >
                                        🗑️ Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default MyJobs;
