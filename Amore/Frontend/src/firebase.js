// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyC2SJ-mBmOZH7VJsS7aclmR9HPkhndFZY4',
    authDomain: 'auth-dev-de985.firebaseapp.com',
    databaseURL:
        'https://auth-dev-de985-default-rtdb.asia-southeast1.firebasedatabase.app',
    projectId: 'auth-dev-de985',
    storageBucket: 'auth-dev-de985.appspot.com',
    messagingSenderId: '805422639519',
    appId: '1:805422639519:web:760f3873c1b04f858c75aa',
    measurementId: 'G-FW6DJSX3SS',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

