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
    setDoc,
    deleteDoc,
} from "firebase/firestore";
import { auth, db } from "../../../firebase/firebaseConfig";
import PageMeta from "../../../components/common/PageMeta";
import { FaArrowLeft } from "react-icons/fa";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface Message {
    id: string;
    senderId: string;
    text: string;
    timestamp: any;
    readBy?: string[];
}

interface UserInfo {
    photoURL?: string;
    firstName?: string;
    online?: boolean;
    lastSeen?: any;
}

const FreelancerChatRoom = () => {
    const { chatId } = useParams();
    const userId = auth.currentUser?.uid;
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [otherUser, setOtherUser] = useState<UserInfo | null>(null);
    const [typing, setTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const typingTimeout = useRef<NodeJS.Timeout | null>(null);
    const otherUserIdRef = useRef<string | null>(null);

    useEffect(() => {
        if (!chatId || !userId) return;

        const chatDocRef = doc(db, "chats", chatId);
        const unsubscribeChat = onSnapshot(chatDocRef, (chatDoc) => {
            const chatData = chatDoc.data();
            if (!chatData?.participants) return;

            const otherId = chatData.participants.find((id: string) => id !== userId);
            if (!otherId) return;
            otherUserIdRef.current = otherId;

            const userDocRef = doc(db, "users", otherId);
            const unsubscribeUser = onSnapshot(userDocRef, (userSnap) => {
                if (userSnap.exists()) {
                    const data = userSnap.data();
                    setOtherUser({
                        photoURL: data.photoURL,
                        firstName: data.firstName,
                        online: data.online,
                        lastSeen: data.lastSeen?.toDate(),
                    });
                }
            });

            const typingDocRef = doc(db, "typingStatus", `${chatId}_${otherId}`);
            const unsubscribeTyping = onSnapshot(typingDocRef, (typingSnap) => {
                setTyping(typingSnap.exists());
            });

            return () => {
                unsubscribeUser();
                unsubscribeTyping();
            };
        });

        return () => unsubscribeChat();
    }, [chatId, userId]);

    useEffect(() => {
        if (!chatId || !userId) return;

        const q = query(collection(db, "chats", chatId, "messages"), orderBy("timestamp", "asc"));

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

        await deleteDoc(doc(db, "typingStatus", `${chatId}_${userId}`));
    };

    const handleTyping = async () => {
        if (!chatId || !userId) return;
        await setDoc(doc(db, "typingStatus", `${chatId}_${userId}`), {
            userId,
            isTyping: true,
            timestamp: Date.now(),
        });

        if (typingTimeout.current) clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(async () => {
            await deleteDoc(doc(db, "typingStatus", `${chatId}_${userId}`));
        }, 2000);
    };

    return (
        <>
            <PageMeta title="Chat Room" description="Chat with client." />
            <audio ref={audioRef} src="/message-tone.mav" preload="auto" />
            <div className="p-6 h-[80vh] flex flex-col">
                <div className="mb-4 flex items-center gap-3">
                    <FaArrowLeft
                        className="cursor-pointer text-gray-600"
                        onClick={() => window.history.back()}
                    />
                    {otherUser?.photoURL ? (
                        <img
                            src={otherUser.photoURL}
                            alt="avatar"
                            className="w-10 h-10 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium text-white">
                            {otherUser?.firstName?.charAt(0) || "U"}
                        </div>
                    )}
                    <div>
                        <h2 className="text-base font-semibold">{otherUser?.firstName || "User"}</h2>
                        <p className="text-xs text-gray-500">
                            {otherUser?.online
                                ? "Online"
                                : otherUser?.lastSeen
                                    ? `Last seen ${dayjs(otherUser.lastSeen).fromNow()}`
                                    : "Offline"}
                        </p>
                    </div>
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
                            <p>{msg.text}</p>
                            {msg.timestamp?.toDate && (
                                <p className="text-[10px] mt-1 text-right opacity-70">
                                    {dayjs(msg.timestamp.toDate()).format("h:mm A")}
                                </p>
                            )}
                        </div>
                    ))}
                    {typing && (
                        <div className="text-sm italic text-gray-500 animate-pulse">
                            {otherUser?.firstName || "User"} is typing...
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => {
                            setNewMessage(e.target.value);
                            handleTyping();
                        }}
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
