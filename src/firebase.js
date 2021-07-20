import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyBpVbtOu_ibN2Xi3STA4XtfK_Im2B_7dko",
    authDomain: "netflix-clone-4b219.firebaseapp.com",
    projectId: "netflix-clone-4b219",
    storageBucket: "netflix-clone-4b219.appspot.com",
    messagingSenderId: "872024017063",
    appId: "1:872024017063:web:428146c89c5cfaaeb4b382"
  };

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();

export { auth };
export default db;