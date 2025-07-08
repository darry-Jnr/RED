import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp,
    updateDoc,
    doc,
} from "firebase/firestore";
import { auth, db } from "../../../firebase/firebaseConfig";
import PageMeta from "../../../components/common/PageMeta";
import { FaArrowLeft } from "react-icons/fa";

interface Message {
    id: string;
    senderId: string;
    text: string;
    timestamp: any;
    readBy?: string[];
}

const FreelancerChatRoom = () => {
    const { chatId } = useParams();
    const userId = auth.currentUser?.uid;
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (!chatId || !userId) return;

        const q = query(
            collection(db, "chats", chatId, "messages"),
            orderBy("timestamp", "asc")
        );

        const unsubscribe = onSnapshot(q, async (snapshot) => {
            const msgs: Message[] = [];
            const updates: Promise<any>[] = [];

            snapshot.forEach((docSnap) => {
                const data = docSnap.data() as Message;
                msgs.push({ id: docSnap.id, ...data });

                const notSeen = !data.readBy || !data.readBy.includes(userId);

                if (data.senderId !== userId && notSeen) {
                    updates.push(
                        updateDoc(doc(db, "chats", chatId, "messages", docSnap.id), {
                            readBy: [...(data.readBy || []), userId],
                        })
                    );

                    // 🔊 play sound
                    if (audioRef.current) audioRef.current.play();
                }
            });

            setMessages(msgs);
            scrollToBottom();
            await Promise.all(updates);
        });

        return () => unsubscribe();
    }, [chatId, userId]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSend = async () => {
        if (!newMessage.trim() || !chatId || !userId) return;

        const message = {
            senderId: userId,
            text: newMessage.trim(),
            timestamp: serverTimestamp(),
            readBy: [userId],
        };

        await addDoc(collection(db, "chats", chatId, "messages"), message);
        setNewMessage("");
        scrollToBottom();
    };

    return (
        <>
            <PageMeta title="Chat Room" description="Chat with client." />
            <audio ref={audioRef} src="/message-tone.mav" preload="auto" />
            <div className="p-6 h-[80vh] flex flex-col">
                <div className="mb-4 flex items-center gap-2">
                    <FaArrowLeft
                        className="cursor-pointer"
                        onClick={() => window.history.back()}
                    />
                    <h2 className="text-xl font-semibold">Chat</h2>
                </div>

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
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
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
