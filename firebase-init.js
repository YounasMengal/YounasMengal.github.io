import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

if(typeof window.firebaseConfig === 'undefined') console.warn('firebaseConfig missing. Add firebase-config.js with your project's config.');

const app = initializeApp(window.firebaseConfig || {});
export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);

// fixed two-user chat id
export const CHAT_ID = 'mengal_zainee';

// helper to get sanitized local id for presence/typing path
export function safeIdFromEmail(email){
  if(!email) return email;
  return email.replace(/[^a-z0-9]/gi,'_').toLowerCase();
}

export async function signInAs(email, password){
  try{
    const res = await signInWithEmailAndPassword(auth, email, password);
    return res.user;
  }catch(err){
    console.error('Sign-in failed', err);
    throw err;
  }
}

export function onAuth(cb){ onAuthStateChanged(auth, cb); }
