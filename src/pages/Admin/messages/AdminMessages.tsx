import { useEffect, useState } from "react";
import { db } from "../../../firebase/firebaseConfig";
import {
    collection,
    getDocs,
    doc,
    getDoc,
} from "firebase/firestore";

export default function AdminMessages() {
    const [chatThreads, setChatThreads] = useState<any[]>([]);

    useEffect(() => {
        const fetchChatsWithNames = async () => {
            const chatsSnapshot = await getDocs(collection(db, "chats"));
            const threads: any[] = [];

            for (const chatDoc of chatsSnapshot.docs) {
                const chatData = chatDoc.data();
                const { participants } = chatData;

                // Get full names from user IDs
                const names = await Promise.all(
                    participants.map(async (uid: string) => {
                        const userDoc = await getDoc(doc(db, "users", uid));
                        const userData = userDoc.exists() ? userDoc.data() : null;
                        return userData?.fullName || "Unknown User";
                    })
                );

                threads.push({
                    id: chatDoc.id,
                    participants: names,
                });
            }

            setChatThreads(threads);
        };

        fetchChatsWithNames();
    }, []);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">All Conversations</h2>
            <div className="space-y-4">
                {chatThreads.map((chat) => (
                    <div key={chat.id} className="p-4 border rounded shadow">
                        <p>
                            <span className="font-medium">Participants:</span>{" "}
                            {chat.participants.join(" & ")}
                        </p>
                        <button
                            className="mt-2 px-3 py-1 bg-blue-500 text-white rounded"
                            onClick={() =>
                                (window.location.href = `/admin/messages/chat/${chat.id}`)
                            }
                        >
                            View Chat
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
