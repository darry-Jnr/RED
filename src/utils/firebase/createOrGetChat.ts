// utils/firebase/createOrGetChat.ts
import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

// This creates or gets a chat room between client and freelancer
export const createOrGetChat = async ({
    clientId,
    freelancerId,
    job,
}: {
    clientId: string;
    freelancerId: string;
    job: {
        id: string;
        title: string;
        budget: number;
    };
}) => {
    const chatsRef = collection(db, "chats");

    // Step 1: Check for existing chat
    const q = query(chatsRef, where("participants", "array-contains", freelancerId));
    const snapshot = await getDocs(q);

    for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        if (data.participants.includes(clientId)) {
            return docSnap.id; // Existing chat
        }
    }

    // Step 2: Create new chat
    const newChat = await addDoc(chatsRef, {
        participants: [clientId, freelancerId],
        createdAt: serverTimestamp(),
    });

    // Step 3: Send job preview message as first message
    await addDoc(collection(db, "chats", newChat.id, "messages"), {
        senderId: freelancerId,
        text: `📄 Job: ${job.title} | Budget: ₦${job.budget}`,
        jobId: job.id,
        isJobPreview: true,
        timestamp: serverTimestamp(),
    });

    return newChat.id;
};
