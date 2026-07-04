// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA3DNdHOAsPj1Lw0eOZf1b-axdMDREXo0A",
  authDomain: "agrimaster-1c248.firebaseapp.com",
  projectId: "agrimaster-1c248",
  storageBucket: "agrimaster-1c248.firebasestorage.app",
  messagingSenderId: "741664844765",
  appId: "1:741664844765:web:e172d74fc333f9a600e434",
  measurementId: "G-D48HJNSX7J"
};

// Initialisation
const app = initializeApp(firebaseConfig);

// Services Firebase
const auth = getAuth(app);
const db = getFirestore(app);

// Export
export { auth, db };