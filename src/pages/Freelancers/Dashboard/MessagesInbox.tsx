import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase/firebaseConfig";

const FreelancerMessagesInbox = () => {
    const [chats, setChats] = useState<any[]>([]);
    const [userNames, setUserNames] = useState<{ [id: string]: string }>({});
    const userId = auth.currentUser?.uid;

    useEffect(() => {
        if (!userId) return;

        const fetchChats = async () => {
            const q = query(collection(db, "chats"), where("participants", "array-contains", userId));
            const snapshot = await getDocs(q);
            const chatList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setChats(chatList);

            // Fetch names of other participants
            chatList.forEach(async (chat) => {
                const otherId = chat.participants.find((id: string) => id !== userId);
                if (otherId && !userNames[otherId]) {
                    const userSnap = await getDoc(doc(db, "users", otherId));
                    if (userSnap.exists()) {
                        const data = userSnap.data();
                        setUserNames((prev) => ({ ...prev, [otherId]: data.firstName || "User" }));
                    }
                }
            });
        };

        fetchChats();
    }, [userId]);

    return (
        <div className="p-6">
            <h1 className="text-xl font-semibold mb-4">Your Chats</h1>
            {chats.length === 0 ? (
                <p>No chats yet.</p>
            ) : (
                <ul className="space-y-3">
                    {chats.map((chat) => {
                        const otherId = chat.participants.find((id: string) => id !== userId);
                        return (
                            <li key={chat.id}>
                                <Link
                                    to={`/freelancer/messages/${chat.id}`}
                                    className="block p-4 rounded-lg shadow bg-white hover:bg-gray-100"
                                >
                                    Chat with: {userNames[otherId] || "Loading..."}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default FreelancerMessagesInbox;
