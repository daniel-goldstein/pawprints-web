import firebase from 'firebase';
import { FIREBASE_CONFIG } from "./properties";

let fire = firebase.initializeApp(FIREBASE_CONFIG);
let rootRef = fire.database().ref();
let cluesRef = rootRef.child('clues');
// let cluesRef = fire.database().ref('clues').orderByKey().limitToLast(100);

export {
  fire,
  cluesRef
}

