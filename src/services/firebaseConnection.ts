// firebaseConnection.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";


const anotherFirebaseConfig = {
  apiKey: "AIzaSyDorDJQHWpM9DE0Gumcfatguqkejvm44zI",
  authDomain: "chatonline-b9c83.firebaseapp.com",
  projectId: "chatonline-b9c83",
  storageBucket: "chatonline-b9c83.appspot.com",
  messagingSenderId: "761213364644",
  appId: "1:761213364644:web:52576a547e75815c3fb931",
  measurementId: "G-S07YPLBB2N"
};

const newChatApp = initializeApp(anotherFirebaseConfig);


const newDb = getFirestore(newChatApp);
const newAuth = getAuth(newChatApp);
const newStorage = getStorage(newChatApp);


export { newDb as db, newAuth as auth, newStorage as storage };
