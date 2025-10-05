import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, updateProfile } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { doc, setDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { auth, db } from './common.js';

if (document.getElementById('loginForm')) {
  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = 'chat.html';
    } catch (error) {
      alert(`Login failed: ${error.message}`);
    }
  });
}

if (document.getElementById('signupForm')) {
  document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const displayName = document.getElementById('signupDisplayName').value;
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName });
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email, displayName, createdAt: new Date(), online: true
      });
      alert('Account created!');
      window.location.href = 'chat.html';
    } catch (error) {
      alert(`Signup failed: ${error.message}`);
    }
  });
}
