import { auth } from './common.js';
import { reauthenticateWithCredential, updatePassword, EmailAuthProvider } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

const form = document.getElementById('changePasswordForm');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const oldPassword = document.getElementById('oldPassword').value;
  const newPassword = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  if (newPassword !== confirmPassword) {
    alert('❌ New passwords do not match!');
    return;
  }

  const user = auth.currentUser;
  if (!user) {
    alert('You must be logged in to change your password.');
    window.location.href = 'login.html';
    return;
  }

  try {
    const credential = EmailAuthProvider.credential(user.email, oldPassword);
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);
    alert('✅ Password updated successfully!');
    window.location.href = 'settings.html';
  } catch (error) {
    console.error('Error updating password:', error);
    alert(`⚠️ Failed to change password: ${error.message}`);
  }
});
