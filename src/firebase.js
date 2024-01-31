
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
    apiKey: "AIzaSyBsT0chgmXjchOobZk1YbXC1462_81gVjg",
    authDomain: "mantenimiento-incendio.firebaseapp.com",
    projectId: "mantenimiento-incendio",
    storageBucket: "mantenimiento-incendio.appspot.com",
    messagingSenderId: "698721981448",
    appId: "1:698721981448:web:842b7a6de5a0e7de5e6dbd"
  };


const fb = firebase.initializeApp(firebaseConfig);
export const db = fb.firestore();
export const storage = fb.storage();