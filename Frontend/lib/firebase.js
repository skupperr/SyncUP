// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
// import { getStorage } from "firebase/storage";
// import { firebaseConfig } from "./firebase-config.js"; // import secrets

// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// export const auth = getAuth();
// export const db = getFirestore();
// export const storage = getStorage();


import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";


import { firebaseConfig } from "./firebase-config.js"; // import secrets

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
