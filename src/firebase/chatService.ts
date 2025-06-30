import {
    addDoc,
    collection,
    serverTimestamp,
    query,
    orderBy,
    onSnapshot,
    deleteDoc,
    doc,
    updateDoc,
} from "firebase/firestore";
import { db } from "./firebaseConfig";

export const sendMessage = async (chatId: string, data: any) => {
    await addDoc(collection(db, "chats", chatId, "messages"), {
        ...data,
        timestamp: serverTimestamp(),
        status: "sent",
    });
};

export const listenToMessages = (chatId: string, callback: Function) => {
    const q = query(collection(db, "chats", chatId, "messages"), orderBy("timestamp", "asc"));
    return onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        callback(messages);
    });
};

export const deleteMessage = async (chatId: string, messageId: string) => {
    await deleteDoc(doc(db, "chats", chatId, "messages", messageId));
};

export const editMessage = async (chatId: string, messageId: string, newText: string) => {
    await updateDoc(doc(db, "chats", chatId, "messages", messageId), { text: newText });
};
