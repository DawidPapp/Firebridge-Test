import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getFirestore, collection, doc, getDocs, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAt8FHyX2stSDCJ0aekThMvEZTDQMVGN3Q",
  authDomain: "fiebridge-test-project.firebaseapp.com",
  projectId: "fiebridge-test-project",
  storageBucket: "fiebridge-test-project.firebasestorage.app",
  messagingSenderId: "169129683330",
  appId: "1:169129683330:web:e51a3578dc7a2eb1a1879b"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Jednorazowe logowanie anonimowe przy starcie instancji
signInAnonymously(auth).catch(console.error);

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Content-Type", "application/json");

  const path = req.query.path || "twojaKolekcja";   // np. users lub settings/global

  try {
    let data;

    if (path.includes("/")) {
      // pojedynczy dokument: "settings/global"
      const ref = doc(db, path);
      const snap = await getDoc(ref);
      data = snap.exists() ? { id: snap.id, ...snap.data() } : null;
    } else {
      // cała kolekcja: "users"
      const ref = collection(db, path);
      const snapshot = await getDocs(ref);
      data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
}