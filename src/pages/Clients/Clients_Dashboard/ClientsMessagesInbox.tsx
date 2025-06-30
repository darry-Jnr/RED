import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../../../firebase/firebaseConfig";
import PageMeta from "../../../components/common/PageMeta";

const ClientsMessagesInbox = () => {
    const [chats, setChats] = useState<any[]>([]);
    const userId = auth.currentUser?.uid;

    useEffect(() => {
        const fetchChats = async () => {
            const querySnapshot = await getDocs(collection(db, "chats"));
            const chatList = querySnapshot.docs
                .map((doc) => ({ id: doc.id, ...doc.data() }))
                .filter((chat) => chat.participants?.includes(userId));
            setChats(chatList);
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
                        const otherId = chat.participants.find((id: string) => id !== userId);
                        return (
                            <li key={chat.id}>
                                <Link
                                    to={`/clients/messages/${chat.id}`}
                                    className="block p-4 rounded-lg shadow bg-white hover:bg-gray-100"
                                >
                                    Chat with: {otherId}
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
