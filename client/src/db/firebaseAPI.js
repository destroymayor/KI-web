import firebase from "firebase";

const config = {
  apiKey: "AIzaSyCxGS6j9XbO2t2ntViIDqlRd86aN9uanZA",
  authDomain: "kwidentifier.firebaseapp.com",
  databaseURL: "https://kwidentifier.firebaseio.com",
  projectId: "kwidentifier",
  storageBucket: "",
  messagingSenderId: "655585071981"
};
const FirebaseApp = firebase.initializeApp(config);

export default FirebaseApp;
