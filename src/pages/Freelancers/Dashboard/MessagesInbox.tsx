import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase/firebaseConfig";

interface Chat {
    id: string;
    participants: string[];
}

interface UserInfo {
    name: string;
    photoURL: string;
}

const FreelancerMessagesInbox = () => {
    const [chats, setChats] = useState<Chat[]>([]);
    const [userInfos, setUserInfos] = useState<{ [id: string]: UserInfo }>({});
    const userId = auth.currentUser?.uid;

    useEffect(() => {
        if (!userId) return;

        const fetchChats = async () => {
            const q = query(collection(db, "chats"), where("participants", "array-contains", userId));
            const snapshot = await getDocs(q);
            const chatList: Chat[] = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...(doc.data() as Omit<Chat, "id">),
            }));
            setChats(chatList);

            for (const chat of chatList) {
                const otherId = chat.participants.find((id) => id !== userId);
                if (otherId && !userInfos[otherId]) {
                    const userSnap = await getDoc(doc(db, "users", otherId));
                    if (userSnap.exists()) {
                        const data = userSnap.data();
                        setUserInfos((prev) => ({
                            ...prev,
                            [otherId]: {
                                name: data.firstName || "User",
                                photoURL: data.photoURL || "", // default to blank if missing
                            },
                        }));
                    }
                }
            }
        };

        fetchChats();
    }, [userId]);

    return (
        <div className="">
            <h1 className="text-xl font-semibold mb-4">Chats</h1>
            {chats.length === 0 ? (
                <p>No chats yet.</p>
            ) : (
                <ul className="space-y-3">
                    {chats.map((chat) => {
                        const otherId = chat.participants.find((id) => id !== userId);
                        const user = userInfos[otherId ?? ""];

                        return (
                            <li key={chat.id}>
                                <Link
                                    to={`/freelancer/messages/${chat.id}`}
                                    className="flex items-center gap-3 p-4 rounded-lg shadow bg-white hover:bg-gray-100"
                                >
                                    {user?.photoURL ? (
                                        <img
                                            src={user.photoURL}
                                            alt="avatar"
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium text-white">
                                            {user?.name?.charAt(0) || "U"}
                                        </div>
                                    )}
                                    <span className="text-base font-medium">
                                        {user?.name || "Loading..."}
                                    </span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default FreelancerMessagesInbox;
