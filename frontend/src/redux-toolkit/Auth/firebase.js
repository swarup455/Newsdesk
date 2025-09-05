import {getAuth, GoogleAuthProvider} from "firebase/auth"
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD3x_SCaYMUpNFAqRs6SJTSXiqbOyv0dks",
  authDomain: "login-35c98.firebaseapp.com",
  projectId: "login-35c98",
  storageBucket: "login-35c98.firebasestorage.app",
  messagingSenderId: "478269447118",
  appId: "1:478269447118:web:718e1560a42ca4f07b299f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export {auth, provider}