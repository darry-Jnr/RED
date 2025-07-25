import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    doc,
    getDoc,
    collection,
    getDocs,
} from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import { AiOutlineArrowLeft } from "react-icons/ai";

export default function AdminChatRoom() {
    const { chatId } = useParams();
    const navigate = useNavigate();
    const [messages, setMessages] = useState<any[]>([]);
    const [userCache, setUserCache] = useState<{ [uid: string]: string }>({});
    const [adminUid, setAdminUid] = useState("admin");

    useEffect(() => {
        const fetchMessages = async () => {
            const messagesRef = collection(db, "chats", chatId, "messages");
            const messageSnap = await getDocs(messagesRef);

            const tempMessages: any[] = [];

            for (const docSnap of messageSnap.docs) {
                const data = docSnap.data();

                let fullName = userCache[data.senderId];
                if (!fullName) {
                    const userRef = doc(db, "users", data.senderId);
                    const userSnap = await getDoc(userRef);
                    fullName = userSnap.exists() ? userSnap.data().fullName : "Unknown User";
                    setUserCache((prev) => ({ ...prev, [data.senderId]: fullName }));
                }

                tempMessages.push({
                    ...data,
                    id: docSnap.id,
                    fullName,
                });
            }

            const sorted = tempMessages.sort((a, b) => a.timestamp?.seconds - b.timestamp?.seconds);
            setMessages(sorted);
        };

        fetchMessages();
    }, [chatId]);

    return (
        <div className="p-4 h-[90vh] overflow-hidden">
            {/* Back button and title */}
            <div className="flex items-center gap-2 mb-4">
                <button
                    onClick={() => navigate(-1)}
                    className="text-gray-700 hover:text-blue-600 transition"
                >
                    <AiOutlineArrowLeft className="w-6 h-6" />
                </button>
                <h2 className="text-xl font-semibold">Chat: {chatId}</h2>
            </div>

            {/* Messages */}
            <div className="flex flex-col gap-2 h-full overflow-y-auto bg-gray-100 p-4 rounded-lg border">
                {messages.map((msg) => {
                    const isSender = msg.senderId === adminUid;
                    return (
                        <div
                            key={msg.id}
                            className={`flex items-end ${isSender ? "justify-end" : "justify-start"}`}
                        >
                            {!isSender && (
                                <div className="w-8 h-8 bg-blue-500 text-white flex items-center justify-center rounded-full mr-2 text-xs font-bold">
                                    {msg.fullName?.[0]}
                                </div>
                            )}
                            <div
                                className={`p-3 rounded-lg shadow max-w-xs break-words ${isSender ? "bg-blue-600 text-white" : "bg-white text-gray-800"
                                    }`}
                            >
                                <p className="text-sm font-medium">{!isSender && msg.fullName}</p>
                                <p className="text-sm">{msg.text}</p>
                                <p className="text-[10px] text-gray-400 mt-1 text-right">
                                    {msg.timestamp?.toDate?.().toLocaleString()}
                                </p>
                            </div>
                            {isSender && (
                                <div className="w-8 h-8 bg-gray-400 text-white flex items-center justify-center rounded-full ml-2 text-xs font-bold">
                                    A
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
