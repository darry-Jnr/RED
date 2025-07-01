// pages/Freelancers/Dashboard/FreelancerChatRoom.tsx
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import {
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../../../firebase/firebaseConfig";
import PageMeta from "../../../components/common/PageMeta";

const FreelancerChatRoom = () => {
    const { chatId } = useParams();
    const userId = auth.currentUser?.uid;
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!chatId) return;

        const messagesRef = collection(db, "chats", chatId, "messages");
        const q = query(messagesRef, orderBy("timestamp", "asc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setMessages(msgs);
            scrollToBottom();
        });

        return () => unsubscribe();
    }, [chatId]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSend = async () => {
        if (!newMessage.trim() || !chatId || !userId) return;

        await addDoc(collection(db, "chats", chatId, "messages"), {
            senderId: userId,
            text: newMessage.trim(),
            timestamp: serverTimestamp(),
        });
        setNewMessage("");
        scrollToBottom();
    };

    return (
        <>
            <PageMeta title="Chat Room" description="Chat with client." />
            <div className="p-6 h-[80vh] flex flex-col">
                <h2 className="text-xl font-semibold mb-4">Chat</h2>

                <div className="flex-1 overflow-y-auto mb-4 bg-white rounded p-4 space-y-3 border border-gray-200">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`max-w-[70%] px-4 py-2 rounded-lg ${msg.senderId === userId
                                    ? "bg-blue-500 text-white self-end ml-auto"
                                    : "bg-gray-100 text-gray-800 self-start mr-auto"
                                }`}
                        >
                            {msg.text}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1 border rounded px-4 py-2"
                    />
                    <button
                        onClick={handleSend}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Send
                    </button>
                </div>
            </div>
        </>
    );
};

export default FreelancerChatRoom;
