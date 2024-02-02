// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import {getStorage} from 'firebase/storage';
import {getFirestore} from 'firebase/firestore';
import {getAuth} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCCIB47nZlh4ZgCRZvZK-AXF3MjMsk_Euw",
  authDomain: "chatonline-8864b.firebaseapp.com",
  projectId: "chatonline-8864b",
  storageBucket: "chatonline-8864b.appspot.com",
  messagingSenderId: "798226275564",
  appId: "1:798226275564:web:8fc54384a5371db36519c9",
  measurementId: "G-BBKTF482JD"
};

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
const storage = getStorage(firebaseApp);


export {db, auth, storage};