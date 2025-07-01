import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../../../firebase/firebaseConfig";

interface Chat {
    id: string;
    participants: string[];
    // add other fields if needed
}

const FreelancerMessagesInbox = () => {
    const [chats, setChats] = useState<Chat[]>([]);
    const userId = auth.currentUser?.uid;

    useEffect(() => {
        if (!userId) return;

        async function fetchChats() {
            const chatsRef = collection(db, "chats");
            const q = query(chatsRef, where("participants", "array-contains", userId));
            const querySnapshot = await getDocs(q);
            const chatList: Chat[] = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...(doc.data() as Omit<Chat, "id">),
            }));
            setChats(chatList);
        }

        fetchChats();
    }, [userId]);

    return (
        <div>
            <h1>Your Chats</h1>
            {chats.length === 0 ? (
                <p>No chats yet.</p>
            ) : (
                <ul>
                    {chats.map((chat) => {
                        const otherUserId = chat.participants.find((id) => id !== userId);
                        return (
                            <li key={chat.id}>
                                <Link to={`/freelancer/messages/${chat.id}`}>
                                    Chat with: {otherUserId}
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
