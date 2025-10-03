function login(user){
  localStorage.setItem("currentUser", user);
  window.location.href = "chat.html"; 
}