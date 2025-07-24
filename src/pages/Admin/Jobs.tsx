import { useEffect, useState } from "react";
import {
    collection,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { toast } from "react-toastify";

export default function Jobs() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        fetchJobs();
    }, [filter]);

    const fetchJobs = async () => {
        try {
            const jobRef = collection(db, "jobs");
            let q;

            if (filter !== "all") {
                q = query(jobRef, where("status", "==", filter));
            } else {
                q = jobRef;
            }

            const snapshot = await getDocs(q);
            const jobsData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...(doc.data() as Record<string, any>),
            }));
            setJobs(jobsData);
        } catch (error) {
            toast.error("Failed to fetch jobs.");
            console.error(error);
        }
    };

    const updateStatus = async (id: string, status: string) => {
        try {
            const jobRef = doc(db, "jobs", id);
            await updateDoc(jobRef, { status });
            toast.success(`Job ${status}`);
            fetchJobs();
        } catch (error) {
            toast.error("Failed to update job.");
            console.error(error);
        }
    };

    const deleteJob = async (id: string) => {
        const confirm = window.confirm("Are you sure you want to delete this job?");
        if (!confirm) return;

        try {
            const jobRef = doc(db, "jobs", id);
            await deleteDoc(jobRef);
            toast.success("Job deleted.");
            fetchJobs();
        } catch (error) {
            toast.error("Failed to delete job.");
            console.error(error);
        }
    };

    const formatDate = (timestamp: any) => {
        if (!timestamp) return "";
        const date = new Date(timestamp.seconds * 1000);
        return date.toLocaleDateString();
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "approved":
                return "bg-green-100 text-green-800";
            case "rejected":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Manage Jobs</h1>
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="border rounded p-2"
                >
                    <option value="all">All</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>

            <div className="overflow-x-auto rounded shadow">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left px-4 py-2">Title</th>
                            <th className="text-left px-4 py-2">Client</th>
                            <th className="text-left px-4 py-2">Budget</th>
                            <th className="text-left px-4 py-2">Status</th>
                            <th className="text-left px-4 py-2">Posted</th>
                            <th className="text-left px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobs.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-6 text-gray-500">
                                    No jobs found.
                                </td>
                            </tr>
                        ) : (
                            jobs.map((job) => (
                                <tr key={job.id} className="border-t">
                                    <td className="px-4 py-2">{job.title}</td>
                                    <td className="px-4 py-2 text-sm">{job.clientEmail || "Unknown"}</td>
                                    <td className="px-4 py-2">₦{job.budget}</td>
                                    <td className="px-4 py-2">
                                        <span
                                            className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(
                                                job.status
                                            )}`}
                                        >
                                            {job.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2 text-sm">{formatDate(job.createdAt)}</td>
                                    <td className="px-4 py-2 space-x-2">
                                        <button
                                            onClick={() => updateStatus(job.id, "approved")}
                                            className="text-green-600 hover:underline text-sm"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => updateStatus(job.id, "rejected")}
                                            className="text-yellow-600 hover:underline text-sm"
                                        >
                                            Reject
                                        </button>
                                        <button
                                            onClick={() => deleteJob(job.id)}
                                            className="text-red-600 hover:underline text-sm"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
