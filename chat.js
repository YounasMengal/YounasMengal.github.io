import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getDatabase, ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";
import "../firebase-config.js";
const app = initializeApp(window.firebaseConfig);
const db = getDatabase(app);

const messagesEl = document.getElementById('messages');
const input = document.getElementById('msgInput');
const sendBtn = document.getElementById('send');
const who = document.getElementById('who');
const user = localStorage.getItem('user') || 'Guest';

who.textContent = user;

const messagesRef = ref(db, 'messages');
sendBtn.addEventListener('click', ()=>{
  const v = input.value.trim();
  if(!v) return;
  push(messagesRef, {user, text:v, ts: Date.now()});
  input.value = '';
});

onChildAdded(messagesRef, snapshot => {
  const m = snapshot.val();
  const d = document.createElement('div');
  d.textContent = m.user + ': ' + m.text;
  messagesEl.appendChild(d);
  messagesEl.scrollTop = messagesEl.scrollHeight;
});