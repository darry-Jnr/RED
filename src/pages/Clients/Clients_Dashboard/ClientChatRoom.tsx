import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import {
    collection,
    addDoc,
    onSnapshot,
    serverTimestamp,
    query,
    orderBy,
} from "firebase/firestore";
import { auth, db } from "../../../firebase/firebaseConfig";
import PageMeta from "../../../components/common/PageMeta";
import Button from "../../../components/ui/button/Button";
import Input from "../../../components/form/input/InputField";

interface Message {
    id: string;
    senderId: string;
    text: string;
    timestamp: any;
}

const ClientChatRoom = () => {
    const { chatId } = useParams();
    const userId = auth.currentUser?.uid;
    const [messages, setMessages] = useState<Message[]>([]);
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
            })) as Message[];
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

        const message = {
            senderId: userId,
            text: newMessage.trim(),
            timestamp: serverTimestamp(),
        };

        await addDoc(collection(db, "chats", chatId, "messages"), message);
        setNewMessage("");
        scrollToBottom();
    };

    return (
        <>
            <PageMeta title="Chat Room" description="Chat with freelancer or client." />
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
                    <Input
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1"
                    />
                    <Button onClick={handleSend}>Send</Button>
                </div>
            </div>
        </>
    );
};

export default ClientChatRoom;
