import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC5Bg0VqwUulU6n03zQ0Y6XkF5eRGFqEN8",
  authDomain: "klorah-c4dc2.firebaseapp.com",
  projectId: "klorah-c4dc2",
  storageBucket: "klorah-c4dc2.appspot.com",
  messagingSenderId: "532276017665",
  appId: "1:532276017665:web:42b06f78bb5fcc13e7de00",
  measurementId: "G-F1MNVNGFR0"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export default app;
export { analytics, auth, db, storage };
