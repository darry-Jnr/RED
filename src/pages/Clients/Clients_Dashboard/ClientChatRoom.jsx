import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import {
    collection,
    addDoc,
    onSnapshot,
    serverTimestamp,
    query,
    orderBy,
    updateDoc,
    doc,
    getDoc,
} from "firebase/firestore";
import { auth, db } from "../../../firebase/firebaseConfig";
import PageMeta from "../../../components/common/PageMeta";
import Button from "../../../components/ui/button/Button";
import Input from "../../../components/form/input/InputField";
import { payWithPaystack } from "../../../utils/paystack";
import {
    FaArrowLeft,
    FaPlus,
    FaCheckDouble,
    FaEllipsisV,
    FaEdit,
    FaMoneyBillWave,
} from "react-icons/fa";

const ClientChatRoom = () => {
    const { chatId } = useParams();
    const userId = auth.currentUser?.uid;

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [chatPartner, setChatPartner] = useState(null);
    const [budget, setBudget] = useState(null);
    const [isPaid, setIsPaid] = useState(false);
    const [showBudgetMenu, setShowBudgetMenu] = useState(false);
    const [editing, setEditing] = useState(false);
    const [editValue, setEditValue] = useState("");

    const messagesEndRef = useRef(null);

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
                    const jd = jobSnap.data();
                    setBudget(jd?.budget ?? null);
                    setIsPaid(jd?.isPaid ?? false);
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

    const openBudgetEdit = () => {
        setEditing(true);
        setShowBudgetMenu(false);
        setEditValue((budget || "").toString());
    };

    const saveBudget = () => {
        if (!editValue.trim()) return;
        setBudget(parseFloat(editValue));
        setEditing(false);
    };

    const handlePayment = async () => {
        if (!chatId || budget === null) return;

        try {
            const chatSnap = await getDoc(doc(db, "chats", chatId));
            const chatData = chatSnap.data();
            const jobId = chatData?.jobId;
            if (!jobId) return;

            payWithPaystack(budget, async (reference) => {
                const jobRef = doc(db, "jobs", jobId);
                await updateDoc(jobRef, {
                    isPaid: true,
                    budget,
                    escrowAmount: budget,
                    paystackRef: reference,
                    updatedAt: new Date(),
                });

                setIsPaid(true);
                setShowBudgetMenu(false);
                console.log("✅ Escrow payment successful");
            });
        } catch (err) {
            console.error("❌ handlePayment error:", err);
        }
    };

    return (
        <>
            <PageMeta title="Chat Room" description="Chat with freelancer or client." />
            <div className="flex flex-col h-[90vh] max-w-3xl mx-auto bg-white shadow-lg rounded-lg">
                <div className="flex items-center justify-between p-4 border-b bg-white sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <FaArrowLeft
                            className="text-xl text-gray-700 cursor-pointer"
                            onClick={() => window.history.back()}
                        />
                        {chatPartner?.photoURL ? (
                            <img src={chatPartner.photoURL} alt="User" className="w-9 h-9 rounded-full object-cover" />
                        ) : (
                            <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center text-white text-sm">
                                {chatPartner?.fullName?.[0] || "?"}
                            </div>
                        )}
                        <div>
                            <p className="font-medium text-gray-900">{chatPartner?.fullName}</p>
                            <p className="text-sm text-green-500">Online</p>
                        </div>
                    </div>
                    <div className="relative">
                        {editing ? (
                            <div className="flex gap-1 items-center">
                                <input
                                    type="number"
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    className="w-20 px-2 py-1 border rounded text-sm"
                                />
                                <button onClick={saveBudget} className="text-green-600 text-sm">Enter</button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <span className={`font-medium ${isPaid ? "text-green-600" : "text-gray-500"}`}>
                                    ₦{budget ?? "--"}
                                </span>
                                <button onClick={() => setShowBudgetMenu(!showBudgetMenu)}>
                                    <FaEllipsisV className="text-gray-600 hover:text-gray-800" />
                                </button>
                            </div>
                        )}

                        {showBudgetMenu && !editing && (
                            <div className="absolute right-0 mt-2 w-36 bg-white border rounded shadow z-50">
                                {!budget && (
                                    <button onClick={openBudgetEdit} className="flex items-center w-full px-4 py-2 hover:bg-gray-100 gap-2">
                                        <FaEdit /> Set Budget
                                    </button>
                                )}
                                {budget && !isPaid && (
                                    <>
                                        <button onClick={openBudgetEdit} className="flex items-center w-full px-4 py-2 hover:bg-gray-100 gap-2">
                                            <FaEdit /> Edit Budget
                                        </button>
                                        <button onClick={handlePayment} className="flex items-center w-full px-4 py-2 hover:bg-gray-100 gap-2">
                                            <FaMoneyBillWave /> Pay
                                        </button>
                                    </>
                                )}
                                {isPaid && (
                                    <div className="px-4 py-2 text-green-600">Paid ✅</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

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
                                    <FaCheckDouble className={`text-xs ${(msg.readBy?.length || 0) > 1 ? "text-white" : "text-gray-300"}`} />
                                )}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <div className="flex items-center gap-2 border-t p-4 bg-white relative">
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
