import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import {
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp,
    getDoc,
} from "firebase/firestore";
import { auth, db } from "../../../firebase/firebaseConfig";
import {
    FaCheck,
    FaCheckDouble,
    FaEdit,
    FaTrash,
} from "react-icons/fa";
import PageMeta from "../../../components/common/PageMeta";

const Messages = () => {
    const { chatId } = useParams();
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<any[]>([]);
    const [editId, setEditId] = useState<string | null>(null);
    const [longPressedId, setLongPressedId] = useState<string | null>(null);
    const [participantName, setParticipantName] = useState("");
    const longPressTimer = useRef<NodeJS.Timeout | null>(null);

    const freelancerId = auth.currentUser?.uid;
    const messagesRef = collection(db, "chats", chatId!, "messages");

    // Get participant name (optional)
    useEffect(() => {
        const fetchParticipant = async () => {
            const chatDoc = await getDoc(doc(db, "chats", chatId!));
            const data = chatDoc.data();
            if (data?.participants) {
                const otherId = data.participants.find((id: string) => id !== freelancerId);
                setParticipantName(otherId || "");
            }
        };
        fetchParticipant();
    }, [chatId]);

    // Real-time messages
    useEffect(() => {
        const q = query(messagesRef, orderBy("timestamp"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setMessages(msgs);
        });
        return () => unsubscribe();
    }, [chatId]);

    const handleSend = async () => {
        if (!input.trim() || !freelancerId) return;

        if (editId) {
            await updateDoc(doc(messagesRef, editId), {
                text: input,
            });
            setEditId(null);
        } else {
            await addDoc(messagesRef, {
                text: input,
                senderId: freelancerId,
                status: "sent",
                timestamp: serverTimestamp(),
            });
        }
        setInput("");
    };

    const handleEdit = (id: string, text: string) => {
        setEditId(id);
        setInput(text);
        setLongPressedId(null);
    };

    const handleDelete = async (id: string) => {
        await deleteDoc(doc(messagesRef, id));
        setLongPressedId(null);
    };

    const startLongPress = (id: string) => {
        longPressTimer.current = setTimeout(() => {
            setLongPressedId(id);
        }, 600);
    };

    const cancelLongPress = () => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
        }
    };

    return (
        <>
            <PageMeta title="Red | Messages" description="Chat with your client." />
            <div className="flex flex-col h-[calc(100vh-80px)] border rounded shadow-md bg-[#f1f1f1]">
                <div className="bg-[#003152] text-white px-4 py-3 font-semibold text-lg">
                    Chat with {participantName || "Client"}
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {messages.map((msg) => {
                        const isMine = msg.senderId === freelancerId;
                        return (
                            <div
                                key={msg.id}
                                className={`relative group max-w-[75%] px-4 py-2 rounded-2xl text-sm leading-tight break-words ${isMine
                                        ? "bg-[#003152] text-white ml-auto rounded-br-none"
                                        : "bg-white text-gray-800 mr-auto rounded-bl-none"
                                    }`}
                                onMouseDown={() => startLongPress(msg.id)}
                                onMouseUp={cancelLongPress}
                                onTouchStart={() => startLongPress(msg.id)}
                                onTouchEnd={cancelLongPress}
                            >
                                <p>{msg.text}</p>
                                <div className="flex justify-end items-center gap-1 mt-1 text-xs">
                                    {isMine &&
                                        (msg.status === "seen" ? (
                                            <FaCheckDouble className="text-white text-[12px]" />
                                        ) : (
                                            <FaCheck className="text-white text-[12px]" />
                                        ))}
                                </div>

                                {longPressedId === msg.id && isMine && (
                                    <div className="absolute -top-7 right-0 flex gap-2">
                                        <button
                                            onClick={() => handleEdit(msg.id, msg.text)}
                                            className="p-1 bg-white shadow rounded-full hover:bg-gray-100"
                                        >
                                            <FaEdit className="text-[#003152]" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(msg.id)}
                                            className="p-1 bg-white shadow rounded-full hover:bg-gray-100"
                                        >
                                            <FaTrash className="text-red-600" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="p-4 bg-white border-t flex gap-2">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        type="text"
                        placeholder="Type a message"
                        className="flex-1 border rounded-full px-4 py-2 focus:outline-none"
                    />
                    <button
                        onClick={handleSend}
                        className="bg-[#003152] text-white px-6 py-2 rounded-full hover:bg-[#002244] transition"
                    >
                        {editId ? "Update" : "Send"}
                    </button>
                </div>
            </div>
        </>
    );
};

export default Messages;
