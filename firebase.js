import firebase from "firebase";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyBrMBr1bWNXIMziWVyt59bm7AXEMhg4gY4",
  authDomain: "zonghong-whatsapp.firebaseapp.com",
  projectId: "zonghong-whatsapp",
  storageBucket: "zonghong-whatsapp.appspot.com",
  messagingSenderId: "848095527134",
  appId: "1:848095527134:web:642d2101ab473fd0ea824f",
  measurementId: "G-N6GRZ4ZMKN",
};

try {
  firebase.initializeApp(firebaseConfig);
} catch (err) {
  if (!/already exists/.test(err.message)) {
    console.error("Firebase initialization error", err.stack);
  }
}

const db = firebase.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };
