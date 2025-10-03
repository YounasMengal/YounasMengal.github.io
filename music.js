import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getDatabase, ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";
import "../firebase-config.js";
const app = initializeApp(window.firebaseConfig);
const db = getDatabase(app);
const musicRef = ref(db, 'music');

document.getElementById('addSong').addEventListener('click', ()=>{
  const v = document.getElementById('newSong').value.trim();
  if(!v) return;
  push(musicRef, v);
  document.getElementById('newSong').value = '';
});

onChildAdded(musicRef, snap => {
  const li = document.createElement('li');
  li.textContent = snap.val();
  document.getElementById('musicList').appendChild(li);
});