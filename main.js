// assets/main.js - shared helpers
document.addEventListener('DOMContentLoaded', ()=>{
  const user = localStorage.getItem('loggedInUser') || '';
  const greet = document.getElementById('greetUser');
  if(greet && user) greet.textContent = `Welcome ${user} meri jaan 💖`;
  document.querySelectorAll('[data-link]').forEach(b=> b.addEventListener('click', ()=> location.href=b.dataset.link));
});