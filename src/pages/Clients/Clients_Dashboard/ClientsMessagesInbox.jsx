import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    collection,
    getDocs,
    query,
    where,
    doc,
    getDoc,
    orderBy,
} from "firebase/firestore";
import { auth, db } from "../../../firebase/firebaseConfig";
import PageMeta from "../../../components/common/PageMeta";

const ClientsMessagesInbox = () => {
    const [chats, setChats] = useState([]);
    const [userInfos, setUserInfos] = useState({});
    const userId = auth.currentUser?.uid;

    useEffect(() => {
        const fetchChats = async () => {
            if (!userId) return;

            const q = query(
                collection(db, "chats"),
                where("participants", "array-contains", userId)
            );

            const querySnapshot = await getDocs(q);
            const chatList = [];

            for (const docSnap of querySnapshot.docs) {
                const chatData = docSnap.data();
                const chatId = docSnap.id;
                const lastMessage = chatData.messages?.slice(-1)[0] || null;
                const otherUserId = chatData.participants.find((id) => id !== userId);

                if (otherUserId && !userInfos[otherUserId]) {
                    const userSnap = await getDoc(doc(db, "users", otherUserId));
                    if (userSnap.exists()) {
                        const userData = userSnap.data();
                        setUserInfos((prev) => ({
                            ...prev,
                            [otherUserId]: {
                                name: userData.fullName || "User",
                                avatar: userData.photoURL || null,
                            },
                        }));
                    }
                }

                chatList.push({
                    id: chatId,
                    otherUserId,
                    lastMessage,
                    updatedAt: lastMessage?.timestamp?.toDate() || null,
                });
            }

            // Sort by most recent message
            chatList.sort((a, b) => (b.updatedAt?.getTime() || 0) - (a.updatedAt?.getTime() || 0));
            setChats(chatList);
        };

        fetchChats();
    }, [userId]);

    return (
        <>
            <PageMeta title="Messages" description="View your conversations with freelancers." />
            <div className="p-6">
                <h1 className="text-xl font-semibold mb-4">Your Chats</h1>

                {chats.length === 0 ? (
                    <p className="text-gray-500">You have no active chats.</p>
                ) : (
                    <ul className="space-y-3">
                        {chats.map((chat) => {
                            const userInfo = userInfos[chat.otherUserId] || {};
                            return (
                                <li key={chat.id}>
                                    <Link
                                        to={`/clients/messages/${chat.id}`}
                                        className="flex items-center p-4 rounded-lg shadow bg-white hover:bg-gray-100"
                                    >
                                        {userInfo.avatar ? (
                                            <img
                                                src={userInfo.avatar}
                                                alt="User"
                                                className="w-10 h-10 rounded-full mr-3"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-gray-300 mr-3 flex items-center justify-center">
                                                <span className="text-white font-bold text-lg">
                                                    {userInfo.name?.charAt(0) || "U"}
                                                </span>
                                            </div>
                                        )}

                                        <div className="flex-1">
                                            <p className="font-medium">{userInfo.name || "Loading..."}</p>

                                        </div>

                                        {chat.updatedAt && (
                                            <div className="ml-2 text-xs text-gray-400 whitespace-nowrap">
                                                {formatDistanceToNow(chat.updatedAt, { addSuffix: true })}
                                            </div>
                                        )}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </>
    );
};

export default ClientsMessagesInbox;
