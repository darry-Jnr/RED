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
const ClientChatRoom = () => {
    const { chatId } = useParams();
    const userId = auth.currentUser?.uid;

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [chatPartner, setChatPartner] = useState(null);
    const [jobData, setJobData] = useState(null);
    const messagesEndRef = useRef(null);
    const [jobId, setJobId] = useState(null);
    useEffect(() => {
        const fetchChatData = async () => {
            if (!chatId) return;

            try {
                const chatRef = doc(db, "chats", chatId);
                const chatSnap = await getDoc(chatRef);

                if (chatSnap.exists()) {
                    const chatData = chatSnap.data();
                    setJobId(chatData.jobId || null); // 👈 This sets the jobId
                } else {
                    console.error("Chat document not found.");
                }
            } catch (error) {
                console.error("❌ Error fetching chat metadata:", error);
            }
        };

        fetchChatData();
    }, [chatId]);

    // DEBUG LOGS
    useEffect(() => {
        console.log("👀 Current Chat ID:", chatId);
        console.log("🧑 User ID:", userId);
    }, [chatId, userId]);

    useEffect(() => {
        if (!chatId || !userId) return;

        const fetchMeta = async () => {
            try {
                const chatSnap = await getDoc(doc(db, "chats", chatId));
                const chatData = chatSnap.data();

                if (!chatData) return;

                const { clientId, freelancerId, jobId } = chatData;
                const partnerId = clientId === userId ? freelancerId : clientId;

                const partnerSnap = await getDoc(doc(db, "users", partnerId));
                if (partnerSnap.exists()) {
                    const pd = partnerSnap.data();
                    setChatPartner({
                        fullName: pd.fullName || "User",
                        photoURL: pd.photoURL || "",
                    });
                }

                const jobSnap = await getDoc(doc(db, "jobs", jobId));
                if (jobSnap.exists()) {
                    const jd = { ...jobSnap.data(), id: jobId };
                    setJobData(jd);
                    console.log("📦 Job Data Loaded:", jd);
                }
            } catch (err) {
                console.error("❌ Error fetching chat metadata:", err);
            }
        };

        fetchMeta();
    }, [chatId, userId]);

    useEffect(() => {
        if (!chatId || !userId) return;

        const q = query(
            collection(db, "chats", chatId, "messages"),
            orderBy("timestamp", "asc")
        );

        const unsub = onSnapshot(q, (snapshot) => {
            const msgs = [];
            snapshot.forEach((docSnap) =>
                msgs.push({ ...docSnap.data(), id: docSnap.id })
            );
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
                    {/* Left: Partner Info */}
                    <div className="flex items-center gap-3">
                        <FaArrowLeft
                            className="text-xl text-gray-700 cursor-pointer"
                            onClick={() => window.history.back()}
                        />
                        {chatPartner?.photoURL ? (
                            <img
                                src={chatPartner.photoURL}
                                alt="User"
                                className="w-9 h-9 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center text-white text-sm">
                                {chatPartner?.fullName?.[0] || "?"}
                            </div>
                        )}
                        <div>
                            <p className="font-medium text-gray-900">
                                {chatPartner?.fullName}
                            </p>
                            <p className="text-sm text-green-500">Online</p>
                        </div>
                    </div>

                    {/* Right: Escrow Client Logic */}
                    {jobId && (
                        <div className="ml-auto">
                            <EscrowClient jobId={jobId} />
                        </div>
                    )}

                </div>

                {/* CHAT MESSAGES */}
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

                {/* MESSAGE INPUT */}
                <div className="flex items-center gap-2 border-t p-4 bg-white">
                    <button className="text-gray-600 p-2 hover:bg-gray-100 rounded-full">
                        <FaPlus />
                    </button>
                    <Input
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
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
