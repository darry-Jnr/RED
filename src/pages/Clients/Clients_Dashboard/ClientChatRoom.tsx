import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import {
    collection,
    addDoc,
    onSnapshot,
    serverTimestamp,
    query,
    orderBy,
    doc,
    getDoc,
} from "firebase/firestore";

import { auth, db } from "../../../firebase/firebaseConfig";
import PageMeta from "../../../components/common/PageMeta";
import Button from "../../../components/ui/button/Button";
import Input from "../../../components/form/input/InputField";
import { FaArrowLeft, FaPlus, FaCheckDouble } from "react-icons/fa";
import EscrowClient from "../../../components/Escrow/EscrowClient";

interface Message {
    id: string;
    senderId: string;
    text: string;
    timestamp: any;
    readBy?: string[];
}

interface ChatPartner {
    fullName: string;
    photoURL: string;
}

interface JobData {
    id: string;
    [key: string]: any;
}

const ClientChatRoom = () => {
    const { chatId } = useParams<{ chatId: string }>();
    const userId = auth.currentUser?.uid || "";

    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState<string>("");
    const [chatPartner, setChatPartner] = useState<ChatPartner | null>(null);
    const [jobData, setJobData] = useState<JobData | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const fetchChatData = async () => {
            if (!chatId) return;

            try {
                const chatRef = doc(db, "chats", chatId);
                const chatSnap = await getDoc(chatRef);

                if (chatSnap.exists()) {
                    const chatData = chatSnap.data();
                    const jobId = chatData.jobId || null;
                    if (jobId) {
                        const jobSnap = await getDoc(doc(db, "jobs", jobId));
                        if (jobSnap.exists()) {
                            setJobData({ ...jobSnap.data(), id: jobId } as JobData);
                        }
                    }
                }
            } catch (error) {
                console.error("❌ Error fetching chat metadata:", error);
            }
        };

        fetchChatData();
    }, [chatId]);

    useEffect(() => {
        if (!chatId || !userId) return;

        const fetchFreelancerMeta = async () => {
            try {
                const chatSnap = await getDoc(doc(db, "chats", chatId));
                const chatData = chatSnap.data();

                if (!chatData) return;

                const partnerId = chatData.clientId === userId
                    ? chatData.freelancerId
                    : chatData.clientId;

                const partnerSnap = await getDoc(doc(db, "users", partnerId));
                if (partnerSnap.exists()) {
                    const pd = partnerSnap.data();
                    if (pd.fullName) {
                        setChatPartner({
                            fullName: pd.fullName,
                            photoURL: pd.photoURL || "",
                        });
                    } else {
                        console.warn("⚠️ Freelancer fullName is missing in DB");
                    }
                }
            } catch (err) {
                console.error("❌ Error fetching freelancer metadata:", err);
            }
        };

        fetchFreelancerMeta();
    }, [chatId, userId]);

    useEffect(() => {
        if (!chatId || !userId) return;

        const q = query(
            collection(db, "chats", chatId, "messages"),
            orderBy("timestamp", "asc")
        );

        const unsub = onSnapshot(q, (snapshot) => {
            const msgs: Message[] = snapshot.docs.map((docSnap) => ({
                ...(docSnap.data() as Message),
                id: docSnap.id,
            }));
            setMessages(msgs);
            scrollToBottom();
        });

        return () => unsub();
    }, [chatId, userId]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSend = async () => {
        if (!newMessage.trim() || !chatId || !userId) return;

        await addDoc(collection(db, "chats", chatId, "messages"), {
            senderId: userId,
            text: newMessage.trim(),
            timestamp: serverTimestamp(),
            readBy: [userId],
        });

        setNewMessage("");
        scrollToBottom();
    };

    return (
        <>
            <PageMeta title="Chat Room" description="Chat with freelancer or client." />

            <div className="flex flex-col h-[90vh] mx-auto bg-white shadow rounded-lg">
                {/* HEADER */}
                <div className="flex items-center justify-between p-4 border-b bg-white sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <FaArrowLeft
                            className="text-xl text-gray-700 cursor-pointer"
                            onClick={() => window.history.back()}
                        />
                        {chatPartner?.photoURL ? (
                            <img
                                src={chatPartner.photoURL}
                                alt="Freelancer"
                                className="w-9 h-9 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center text-white text-sm">
                                {chatPartner?.fullName?.[0] || "?"}
                            </div>
                        )}
                        <div>
                            <p className="font-medium text-gray-900">{chatPartner?.fullName || "Loading..."}</p>
                            <p className="text-sm text-green-500">Online</p>
                        </div>
                    </div>

                    {jobData?.id && (
                        <div className="ml-auto">
                            <EscrowClient jobId={jobData.id} />
                        </div>
                    )}
                </div>

                {/* MESSAGES */}
                <div className="flex-1 overflow-y-auto p-4 bg-[#f9f9f9] space-y-3">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`relative max-w-[75%] px-4 py-2 rounded-lg text-sm shadow ${msg.senderId === userId
                                ? "bg-blue-500 text-white ml-auto"
                                : "bg-white text-gray-900"
                                }`}
                        >
                            <p>{msg.text}</p>
                            <div className="absolute bottom-1 right-2 text-[10px] flex items-center gap-1 opacity-70">
                                <span>
                                    {msg.timestamp?.toDate?.().toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </span>
                                {msg.senderId === userId && (
                                    <FaCheckDouble
                                        className={`text-xs ${(msg.readBy?.length || 0) > 1
                                            ? "text-white"
                                            : "text-gray-300"
                                            }`}
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* INPUT */}
                <div className="flex items-center gap-2 border-t p-4 bg-white">
                    <button className="text-gray-600 p-2 hover:bg-gray-100 rounded-full">
                        <FaPlus />
                    </button>
                    <Input
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setNewMessage(e.target.value)
                        }
                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                            if (e.key === "Enter") handleSend();
                        }}
                        className="flex-1"
                    />
                    <Button onClick={handleSend}>Send</Button>
                </div>
            </div>
        </>
    );
};

export default ClientChatRoom;
