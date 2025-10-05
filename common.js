/* Firebase common.js */
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore, doc, setDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js';

const firebaseConfig = {
  apiKey: "AIzaSyA3OqZ4IhEWS53B2XphihxdFuVaF-fOdHw",
  authDomain: "mengalzainee-225ea.firebaseapp.com",
  projectId: "mengalzainee-225ea",
  storageBucket: "mengalzainee-225ea.firebasestorage.app",
  messagingSenderId: "714179210181",
  appId: "1:714179210181:web:d025f7a0e2a1920efcb9ac"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
let currentUser = null;

onAuthStateChanged(auth, (user) => {
  currentUser = user;
  if (user) {
    updateUIForAuthState(true);
    updateUserPresence(true);
  } else {
    updateUIForAuthState(false);
    updateUserPresence(false);
  }
});

async function updateUserPresence(isOnline) {
  if (!currentUser) return;
  const userPresenceRef = doc(db, 'presence', currentUser.uid);
  const userRef = doc(db, 'users', currentUser.uid);
  try {
    const presenceData = { online: isOnline, lastSeen: serverTimestamp() };
    await setDoc(userPresenceRef, presenceData, { merge: true });
    await setDoc(userRef, presenceData, { merge: true });
  } catch (error) {
    console.error('Error updating presence:', error);
  }
}

function updateUIForAuthState(isSignedIn) {
  const authElements = document.querySelectorAll('.auth-only');
  const unauthElements = document.querySelectorAll('.unauth-only');
  if (isSignedIn) {
    authElements.forEach(el => el.classList.remove('hidden'));
    unauthElements.forEach(el => el.classList.add('hidden'));
  } else {
    authElements.forEach(el => el.classList.add('hidden'));
    unauthElements.forEach(el => el.classList.remove('hidden'));
  }
}

async function signOutUser() {
  try {
    await updateUserPresence(false);
    await signOut(auth);
    window.location.href = 'index.html';
  } catch (error) {
    console.error('Error signing out:', error);
  }
}

function formatTimestamp(timestamp) {
  if (!timestamp) return '';
  const date = timestamp.toDate();
  const now = new Date();
  const diff = now - date;
  if (diff < 60000) return 'Just now';
  else if (diff < 3600000) return f"${Math.floor(diff / 60000)}m ago";
  else if (diff < 86400000) return f"${Math.floor(diff / 3600000)}h ago";
  else return date.toLocaleDateString();
}

function createHeartAnimation(x, y) {
  const heart = document.createElement('div');
  heart.innerHTML = '❤️';
  heart.style.position = 'fixed';
  heart.style.left = x + 'px';
  heart.style.top = y + 'px';
  heart.style.fontSize = '20px';
  heart.style.pointerEvents = 'none';
  heart.style.zIndex = '1000';
  heart.style.animation = 'float 2s ease-in-out forwards';
  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 2000);
}

document.addEventListener('click', (e) => {
  if (Math.random() < 0.3) createHeartAnimation(e.clientX, e.clientY);
});

export { app, auth, db, storage, currentUser, signOutUser, formatTimestamp, createHeartAnimation };
