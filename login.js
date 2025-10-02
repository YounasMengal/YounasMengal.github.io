import { signInAs } from '../firebase-init.js';
export async function signInAsPreset(email, password){
  try{
    await signInAs(email, password);
    // redirect to chat on success
    location.href = 'chat.html';
  }catch(err){
    alert('Sign-in error. Make sure the Firebase config is set and users exist.\n'+err.message);
  }
}