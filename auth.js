import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import "../firebase-config.js";

const app = initializeApp(window.firebaseConfig);
const auth = getAuth(app);

const emailInput = document.getElementById('email');
const pwInput = document.getElementById('password');
const msg = document.getElementById('msg');
const signin = document.getElementById('signin');
const signout = document.getElementById('signout');

signin.addEventListener('click', async () => {
  const email = emailInput.value.trim();
  const password = pwInput.value.trim();
  try{
    const cred = await signInWithEmailAndPassword(auth, email, password);
    localStorage.setItem('user', email);
    window.location.href = 'chat.html';
  }catch(err){
    msg.textContent = err.message;
  }
});

signout.addEventListener('click', async ()=>{
  await signOut(auth);
  localStorage.removeItem('user');
  msg.textContent = 'Signed out';
});

onAuthStateChanged(auth, user => {
  if(user){
    signout.style.display = 'inline-block';
    signin.style.display = 'none';
  } else {
    signout.style.display = 'none';
    signin.style.display = 'inline-block';
  }
});