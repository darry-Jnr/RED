// utils/setUserPresence.ts
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { getDatabase, ref, onDisconnect, onValue, set } from "firebase/database";
import { db } from "../../firebase/firebaseConfig";
export const setupUserPresence = (userId: string) => {
    const rtdb = getDatabase();
    const statusRef = ref(rtdb, `/status/${userId}`);

    const isOnline = {
        state: "online",
        lastChanged: Date.now(),
    };

    const isOffline = {
        state: "offline",
        lastChanged: Date.now(),
    };

    set(statusRef, isOnline);
    onDisconnect(statusRef).set(isOffline);

    const userDocRef = doc(db, "users", userId);
    updateDoc(userDocRef, {
        online: true,
        lastSeen: serverTimestamp(),
    });

    // Realtime listener
    onValue(statusRef, async (snapshot) => {
        const data = snapshot.val();
        await updateDoc(userDocRef, {
            online: data?.state === "online",
            lastSeen: serverTimestamp(),
        });
    });
};
