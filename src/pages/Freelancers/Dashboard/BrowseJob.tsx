import { useEffect, useState } from "react";
import {
    collection,
    getDocs,
    addDoc,
} from "firebase/firestore";
import { db, auth } from "../../../firebase/firebaseConfig";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import PageMeta from "../../../components/common/PageMeta";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { createOrGetChat } from "../../../utils/firebase/createOrGetChat";

dayjs.extend(relativeTime);

const BrowseJob = () => {
    const [jobs, setJobs] = useState<any[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchJobs = async () => {
            const snapshot = await getDocs(collection(db, "jobs"));
            const jobList = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setJobs(jobList);
        };
        fetchJobs();
    }, []);

    const handleApply = async (job: any) => {
        const freelancer = auth.currentUser;
        if (!freelancer) return toast.error("Please sign in.");

        try {
            // Optional: Save application
            await addDoc(collection(db, "jobs", job.id, "applications"), {
                freelancerId: freelancer.uid,
                appliedAt: new Date(),
            });

            // Create or get chat room
            const chatId = await createOrGetChat({
                clientId: job.clientId,
                freelancerId: freelancer.uid,
                job: {
                    id: job.id,
                    title: job.title,
                    budget: job.budget,
                },
            });

            toast.success("Applied and chat started!");
            navigate(`/freelancer/messages/${chatId}`);
        } catch (error) {
            console.error("❌ Apply error:", error);
            toast.error("Failed to apply or start chat.");
        }
    };

    return (
        <>
            <PageMeta title="Red | Browse Jobs" description="Explore jobs to apply for." />
            <div className="p-6 max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold text-[#003152] mb-4">Browse Jobs</h1>
                <div className="space-y-6">
                    {jobs.map((job) => (
                        <div key={job.id} className="border p-4 rounded-lg bg-white shadow-sm">
                            <h2 className="text-xl font-semibold">{job.title}</h2>
                            <p className="text-gray-700 my-2">{job.description}</p>
                            <p className="text-sm text-gray-600">
                                Budget: ₦{job.budget} • Posted {dayjs(job.createdAt?.toDate()).fromNow()}
                            </p>
                            <button
                                onClick={() => handleApply(job)}
                                className="mt-3 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                            >
                                Apply
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default BrowseJob;
