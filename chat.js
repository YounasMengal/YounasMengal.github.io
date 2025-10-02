import { auth, db, rtdb, CHAT_ID, safeIdFromEmail, onAuth } from '../firebase-init.js';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { ref as rdbRef, set as rdbSet, onDisconnect, onValue } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

const messagesEl = document.getElementById('messages');
const sendBtn = document.getElementById('sendBtn');
const msgInput = document.getElementById('msgInput');
const presenceEl = document.getElementById('presence');
const typingIndicator = document.getElementById('typingIndicator');
let currentUserEmail = null;
let currentUserId = null;
let typingTimeout = null;

function appendMessage(text, who='them', meta=''){
  const li = document.createElement('li');
  li.className = who==='me' ? 'me' : 'them';
  li.textContent = text + (meta ? (' · '+meta) : '');
  messagesEl.appendChild(li);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

onAuth(user => {
  if(user){
    currentUserEmail = user.email || user.uid;
    currentUserId = safeIdFromEmail(currentUserEmail);
    document.getElementById('userArea').innerHTML = '<div style="font-size:13px">Signed in as '+(user.email||user.uid)+' <button id="logout">Logout</button></div>';
    document.getElementById('logout')?.addEventListener('click', async ()=>{ await auth.signOut(); location.href='index.html'; });
    setupPresence();
    subscribeMessages();
    setupTyping();
  } else {
    // not signed in
    appendMessage('Please sign in from the login page', 'them');
  }
});

function setupPresence(){
  const pRef = rdbRef(rtdb, 'presence/'+CHAT_ID+'/'+currentUserId);
  rdbSet(pRef, {online:true, lastSeen: Date.now()});
  try{ onDisconnect(pRef).remove(); }catch(e){ console.warn('onDisconnect may require persistent connection', e); }
  // listen to peer presence
  const peerId = currentUserId === 'mengal_example_com' ? 'zainee_example_com' : 'mengal_example_com';
  onValue(rdbRef(rtdb, 'presence/'+CHAT_ID+'/'+peerId), snap => {
    const v = snap.val();
    if(v && v.online){ presenceEl.textContent = 'Online'; presenceEl.className='presence-online'; }
    else { presenceEl.textContent = 'Offline'; presenceEl.className='presence-offline'; }
  });
}

function subscribeMessages(){
  const msgsRef = collection(db, 'chats', CHAT_ID, 'messages');
  const q = query(msgsRef, orderBy('createdAt'));
  onSnapshot(q, snap => {
    messagesEl.innerHTML='';
    snap.forEach(d => {
      const m = d.data();
      const who = (m.senderId === currentUserEmail) ? 'me' : 'them';
      const t = m.createdAt && m.createdAt.toDate ? m.createdAt.toDate().toLocaleTimeString() : '';
      appendMessage((m.senderName||m.senderId)+': '+m.text, who, t);
    });
  });
}

sendBtn.addEventListener('click', async ()=>{
  const text = msgInput.value.trim(); if(!text) return;
  try{
    await addDoc(collection(db, 'chats', CHAT_ID, 'messages'), {
      senderId: currentUserEmail, senderName: currentUserEmail.split('@')[0], text, createdAt: serverTimestamp()
    });
    msgInput.value='';
    notifyTyping(false);
  }catch(err){ console.error(err); alert('Send failed: '+err.message); }
});

// typing indicator using RTDB path typing/{chatId}/{userId}
function setupTyping(){
  msgInput.addEventListener('input', ()=>{
    notifyTyping(true);
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(()=> notifyTyping(false), 1500);
  });
  // listen typing from peer
  const peerId = currentUserId === 'mengal_example_com' ? 'zainee_example_com' : 'mengal_example_com';
  onValue(rdbRef(rtdb, 'typing/'+CHAT_ID+'/'+peerId), snap => {
    const v = snap.val();
    if(v && v.typing) typingIndicator.textContent = v.name + ' is typing...'; else typingIndicator.textContent='';
  });
}

function notifyTyping(isTyping){
  const tRef = rdbRef(rtdb, 'typing/'+CHAT_ID+'/'+currentUserId);
  rdbSet(tRef, {typing:isTyping, name: currentUserEmail.split('@')[0]});
  if(!isTyping){
    setTimeout(()=> rdbSet(tRef, {typing:false, name:''}), 2000);
  }
}