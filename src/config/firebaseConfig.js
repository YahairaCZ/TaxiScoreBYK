/* // Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { app } from '../firebaseConfig';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCvc20sQ_tXJQGKmDQ4ckRKUEGaRjpvhNk",
  authDomain: "taxiscore-29b42.firebaseapp.com",
  projectId: "taxiscore-29b42",
  storageBucket: "taxiscore-29b42.firebasestorage.app",
  messagingSenderId: "262362331375",
  appId: "1:262362331375:web:424208baba1922eec9031a",
  measurementId: "G-W3G6J173K9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// If you want to use analytics
const analytics = getAnalytics(app);


// Export the app instance for use in other files
export { app }; */


//Configuración para FireBase
// Importa las funciones que necesitas de Firebase
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore"; // Importación de Firestore

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCvc20sQ_tXJQGKmDQ4ckRKUEGaRjpvhNk",
  authDomain: "taxiscore-29b42.firebaseapp.com",
  projectId: "taxiscore-29b42",
  storageBucket: "taxiscore-29b42.firebasestorage.app",
  messagingSenderId: "262362331375",
  appId: "1:262362331375:web:424208baba1922eec9031a",
  measurementId: "G-W3G6J173K9"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Firestore
const db = getFirestore(app);

// Si quieres usar Analytics
const analytics = getAnalytics(app);

// Exportar la instancia de app para usarla en otros archivos
export { app, db }; // Exporta también db
