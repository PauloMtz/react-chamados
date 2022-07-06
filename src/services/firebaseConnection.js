import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore'; // banco de dados

// precisa instalar env-cmd -- npm install env-cmd

let firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID
};

if(!firebase.apps.length){
  firebase.initializeApp(firebaseConfig);
}

export default firebase;