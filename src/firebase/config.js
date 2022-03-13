// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Add firestore storage to app
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyA_JtLNRr6P2nySFD82QDqv6TDruD4gUik',
  authDomain: 'project-mgt-react.firebaseapp.com',
  projectId: 'project-mgt-react',
  storageBucket: 'project-mgt-react.appspot.com',
  messagingSenderId: '657219523664',
  appId: '1:657219523664:web:dbfc9e14f744d989b7ad55',
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore();
const auth = getAuth();

// Get a reference to the storage service, which is used to create references in your storage bucket
const projectStorage = getStorage(firebaseApp);

const timestamp = Timestamp;

export { db, auth, timestamp, projectStorage };
