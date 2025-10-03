// ✅ Current User from localStorage
let currentUser = localStorage.getItem("currentUser");
if(!currentUser){
  window.location.href = "index.html"; // Agar login na ho to wapas bhej do
}
document.getElementById("welcome").textContent = "Welcome, " + currentUser + "!";

// ✅ Firebase Config (replace with your actual keys)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT.firebaseio.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// ✅ Firebase Init
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ✅ DOM Elements
const msgList = document.getElementById("messages");
const input = document.getElementById("msgInput");

// ✅ Send Message
function sendMessage(){
  if(input.value.trim() === "") return;

  db.ref("messages").push({
    user: currentUser,
    text: input.value,
    timestamp: Date.now()
  });
  input.value = "";
}

// ✅ Load Messages (Realtime Listener)
db.ref("messages").on("child_added", snapshot => {
  const msg = snapshot.val();
  let li = document.createElement("li");
  li.textContent = msg.user + ": " + msg.text;
  msgList.appendChild(li);
});

// ✅ Logout
function logout(){
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}