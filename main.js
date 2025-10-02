// Logout
function logout() {
  alert("You have logged out ❤️");
}

// Chat dummy
function sendMessage() {
  const msgBox = document.getElementById("msgInput");
  const messages = document.getElementById("messages");
  if(msgBox.value.trim() !== "") {
    const p = document.createElement("p");
    p.textContent = "You: " + msgBox.value;
    messages.appendChild(p);
    msgBox.value = "";
  }
}

// Countdown
const targetDate = new Date("2025-04-27"); // Example: Mengal ka birthday
function updateCountdown() {
  const now = new Date();
  const diff = targetDate - now;
  if(diff > 0) {
    const days = Math.floor(diff / (1000*60*60*24));
    document.getElementById("countdown").textContent = days + " days left 🎉";
  } else {
    document.getElementById("countdown").textContent = "Today is the Day 🎂❤️";
  }
}
if(document.getElementById("countdown")) {
  setInterval(updateCountdown, 1000);
}
