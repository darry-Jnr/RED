import { doc, setDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../../firebase/firebaseConfig";

import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

interface Job {
    id: string;
    title: string;
    description: string;
    budget: number;
    clientId: string;
}

const ApplyToJob = ({ job }: { job: Job }) => {
    const navigate = useNavigate();

    const handleApply = async () => {
        const freelancer = auth.currentUser;
        if (!freelancer) return toast.error("You must be logged in");

        const clientId = job.clientId;
        const participants = [freelancer.uid, clientId].sort();
        const chatId = participants.join("_");

        try {
            // Create chat document
            const chatRef = doc(db, "chats", chatId);
            await setDoc(chatRef, {
                participants,
                createdAt: serverTimestamp(),
                lastMessage: `Applied for: ${job.title}`,
            }, { merge: true });

            // Add first message
            const messagesRef = collection(db, "chats", chatId, "messages");
            await addDoc(messagesRef, {
                senderId: freelancer.uid,
                content: `Hi, I'm interested in your job: ${job.title}`,
                jobPreview: {
                    title: job.title,
                    description: job.description,
                    budget: job.budget,
                },
                createdAt: serverTimestamp(),
            });

            toast.success("Applied and chat started!");
            navigate(`/freelancers/messages/${chatId}`);
        } catch (error) {
            toast.error("Failed to apply.");
            console.error(error);
        }
    };

    return (
        <button
            onClick={handleApply}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
            Apply
        </button>
    );
};

export default ApplyToJob;
