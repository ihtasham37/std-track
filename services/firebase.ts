
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase, ref, set, get, push, onValue, update, remove } from "firebase/database";

// Fix: Hardcoded Firebase config is valid for client-side applications
const firebaseConfig = {
  apiKey: "AIzaSyAg45j2uch9XR19WAWOFlZUYSdiTC4TSX4",
  authDomain: "alicart-26522.firebaseapp.com",
  databaseURL: "https://alicart-26522-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "alicart-26522",
  storageBucket: "alicart-26522.firebasestorage.app",
  messagingSenderId: "442024440252",
  appId: "1:442024440252:web:2c0f3ac35dbea05fcebbb9",
  measurementId: "G-ZPQECMNPYV"
};

// Fix: Use Singleton pattern for Firebase initialization with modular SDK v9+
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getDatabase(app);

console.log("FIREBASE INITIALIZED");

// Profile Management
export const saveUserProfile = async (userId: string, data: any) => {
  const profileRef = ref(db, `users/${userId}/profile`);
  await update(profileRef, {
    ...data,
    updatedAt: Date.now()
  });
};

export const fetchUserProfile = async (userId: string) => {
  const profileRef = ref(db, `users/${userId}/profile`);
  const snapshot = await get(profileRef);
  return snapshot.exists() ? snapshot.val() : null;
};

// Roadmap Management
export const saveUserRoadmap = async (userId: string, roadmap: any) => {
  const roadmapRef = ref(db, `users/${userId}/roadmaps/${roadmap.id}`);
  await set(roadmapRef, roadmap);
};

export const fetchUserRoadmaps = async (userId: string) => {
  const roadmapsRef = ref(db, `users/${userId}/roadmaps`);
  const snapshot = await get(roadmapsRef);
  return snapshot.exists() ? Object.values(snapshot.val()) : [];
};

export const deleteUserRoadmap = async (userId: string, roadmapId: string) => {
  const roadmapRef = ref(db, `users/${userId}/roadmaps/${roadmapId}`);
  await remove(roadmapRef);
};

export const saveChatMessage = async (userId: string, roadmapId: string, message: any) => {
  const chatRef = push(ref(db, `users/${userId}/roadmaps/${roadmapId}/chatHistory`));
  const id = chatRef.key;
  await set(chatRef, { ...message, id });
};

export const deleteChatMessage = async (userId: string, roadmapId: string, messageId: string) => {
  const chatRef = ref(db, `users/${userId}/roadmaps/${roadmapId}/chatHistory/${messageId}`);
  await remove(chatRef);
};

export const clearChatHistory = async (userId: string, roadmapId: string) => {
  const chatRef = ref(db, `users/${userId}/roadmaps/${roadmapId}/chatHistory`);
  await remove(chatRef);
};

export const listenToChat = (userId: string, roadmapId: string, callback: (msgs: any[]) => void) => {
  const chatRef = ref(db, `users/${userId}/roadmaps/${roadmapId}/chatHistory`);
  return onValue(chatRef, (snapshot) => {
    const data = snapshot.val();
    callback(data ? Object.values(data) : []);
  });
}
