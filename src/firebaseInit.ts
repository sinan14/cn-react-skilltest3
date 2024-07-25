// create firebase config here and export the db object
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
//  Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyADJwNOTY3Crc3n6YRFTrIxUkT9yVvaa6c',
  authDomain: 'ninja-react-ed182.firebaseapp.com',
  projectId: 'ninja-react-ed182',
  storageBucket: 'ninja-react-ed182.appspot.com',
  messagingSenderId: '388795917163',
  appId: '1:388795917163:web:f755cacdde0c3ade98222e',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
export const auth = getAuth(app);
