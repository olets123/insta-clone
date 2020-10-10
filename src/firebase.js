import firebase from "firebase";

  const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyCdBVRf8DqCqtbmFH14oL2Z4gFSIEvgL28",
    authDomain: "insta-clone-c97e3.firebaseapp.com",
    databaseURL: "https://insta-clone-c97e3.firebaseio.com",
    projectId: "insta-clone-c97e3",
    storageBucket: "insta-clone-c97e3.appspot.com",
    messagingSenderId: "484810283827",
    appId: "1:484810283827:web:27d5cce36b887f9cf7bc46",
    measurementId: "G-9Y5XJLGVKC"
  });

  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();

  export { db, auth, storage }; 