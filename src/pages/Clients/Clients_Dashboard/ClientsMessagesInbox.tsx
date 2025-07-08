import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    collection,
    getDocs,
    query,
    where,
    doc,
    getDoc,
} from "firebase/firestore";
import { auth, db } from "../../../firebase/firebaseConfig";
import PageMeta from "../../../components/common/PageMeta";

const ClientsMessagesInbox = () => {
    const [chats, setChats] = useState<any[]>([]);
    const [userNames, setUserNames] = useState<{ [id: string]: string }>({});
    const [unreadCounts, setUnreadCounts] = useState<{ [chatId: string]: number }>({});
    const userId = auth.currentUser?.uid;

    useEffect(() => {
        const fetchChats = async () => {
            if (!userId) return;

            const q = query(
                collection(db, "chats"),
                where("participants", "array-contains", userId)
            );
            const querySnapshot = await getDocs(q);
            const chatList = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setChats(chatList);

            for (const chat of chatList) {
                const otherId = chat.participants.find((id: string) => id !== userId);

                if (otherId && !userNames[otherId]) {
                    const userSnap = await getDoc(doc(db, "users", otherId));
                    if (userSnap.exists()) {
                        const data = userSnap.data();
                        setUserNames((prev) => ({
                            ...prev,
                            [otherId]: data.firstName || "User",
                        }));
                    }
                }

                // 🔍 Count unread messages
                const messagesSnapshot = await getDocs(
                    collection(db, "chats", chat.id, "messages")
                );
                const unread = messagesSnapshot.docs.filter(
                    (msg) =>
                        msg.data().senderId !== userId &&
                        !msg.data().readBy?.includes(userId)
                ).length;

                setUnreadCounts((prev) => ({
                    ...prev,
                    [chat.id]: unread,
                }));
            }
        };

        fetchChats();
    }, [userId]);

    return (
        <>
            <PageMeta title="Messages" description="View your conversations with freelancers." />
            <div className="p-6">
                <h1 className="text-xl font-semibold mb-4">Your Chats</h1>
                <ul className="space-y-3">
                    {chats.length === 0 && <p>No messages yet.</p>}
                    {chats.map((chat) => {
                        const otherId = chat.participants.find(
                            (id: string) => id !== userId
                        );
                        const name = userNames[otherId] || "Loading...";
                        const unread = unreadCounts[chat.id] || 0;

                        return (
                            <li key={chat.id}>
                                <Link
                                    to={`/clients/messages/${chat.id}`}
                                    className="flex justify-between items-center p-4 rounded-lg shadow bg-white hover:bg-gray-100"
                                >
                                    <span>Chat with: {name}</span>
                                    {unread > 0 && (
                                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                                            {unread}
                                        </span>
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </>
    );
};

export default ClientsMessagesInbox;
