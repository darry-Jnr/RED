// firebase/firebaseConfig.ts

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // ✅ Add this

const firebaseConfig = {
    apiKey: "AIzaSyDEXMeIXPJEyv7r4mPxiOM1cS56nK6sdzk",
    authDomain: "red-151f4.firebaseapp.com",
    projectId: "red-151f4",
    storageBucket: "red-151f4.appspot.com", // ✅ This is correct now
    messagingSenderId: "652917290390",
    appId: "1:652917290390:web:3772d9772f14989062d9b7",
};

const app = initializeApp(firebaseConfig);

// ✅ Add storage
export const storage = getStorage(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider();
export const googleProvider = new GoogleAuthProvider();

export default app;
