// js/firebase-config.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Replace these with your actual Firebase project values
const firebaseConfig = {


     apiKey: "AIzaSyBB9R8PlqH75aT6i4csQzLJ6A47XDvme-s",
    authDomain: "digitaltimecapsule-2e4a0.firebaseapp.com",
    projectId: "digitaltimecapsule-2e4a0",
    storageBucket: "digitaltimecapsule-2e4a0.firebasestorage.app",
    messagingSenderId: "93803984191",
    appId: "1:93803984191:web:394bab2f592531bd260f8a",
    measurementId: "G-3XVHXSK84N"



  // apiKey: "AIzaSyBeJILrQVpcLAzlg2Kt1z5pt9aDe4OBxfM",
  //   authDomain: "auth-bd2d2.firebaseapp.com",
  //   projectId: "auth-bd2d2",
  //   storageBucket: "auth-bd2d2.firebasestorage.app",
  //   messagingSenderId: "350399634603",
  //   appId: "1:350399634603:web:45d8a88f56085952d3ebee",
  //   measurementId: "G-BQL71TBN56"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase Auth instance
export const auth = getAuth(app);

export const db = getFirestore(app);
















// // firebase.js
// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
// import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
// import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// const firebaseConfig = {

//     apiKey: "AIzaSyBeJILrQVpcLAzlg2Kt1z5pt9aDe4OBxfM",
//     authDomain: "auth-bd2d2.firebaseapp.com",
//     projectId: "auth-bd2d2",
//     storageBucket: "auth-bd2d2.firebasestorage.app",
//     messagingSenderId: "350399634603",
//     appId: "1:350399634603:web:45d8a88f56085952d3ebee",
//     measurementId: "G-BQL71TBN56"
// }
// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);

// export const db = getFirestore(app);