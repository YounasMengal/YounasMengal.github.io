import { db, auth, currentUser, formatTimestamp, createHeartAnimation } from './common.js';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

class ChatManager {
  constructor() {
    this.conversationId = 'main';
    this.initializeElements();
    this.initializeEventListeners();
    this.setupRealtimeListeners();
  }

  initializeElements() {
    this.chatMessages = document.getElementById('chatMessages');
    this.messageInput = document.getElementById('messageInput');
    this.sendBtn = document.getElementById('sendBtn');
    this.heartBtn = document.getElementById('heartBtn');
    this.typingIndicator = document.getElementById('typingIndicator');
  }

  initializeEventListeners() {
    this.sendBtn.addEventListener('click', () => this.sendMessage());
    this.heartBtn.addEventListener('click', () => this.sendHeart());
    this.messageInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });
  }

  setupRealtimeListeners() {
    const messagesRef = collection(db, 'conversations', this.conversationId, 'messages');
    const messagesQuery = query(messagesRef, orderBy('createdAt', 'asc'));

    onSnapshot(messagesQuery, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          this.displayMessage(change.doc.data(), change.doc.id);
        }
      });
      this.scrollToBottom();
    });
  }

  async sendMessage() {
    const text = this.messageInput.value.trim();
    if (!text) return;
    try {
      const messagesRef = collection(db, 'conversations', this.conversationId, 'messages');
      await addDoc(messagesRef, {
        senderId: currentUser.uid,
        text: text,
        createdAt: serverTimestamp(),
        readBy: [currentUser.uid],
        type: 'text'
      });
      this.messageInput.value = '';
      createHeartAnimation(window.innerWidth/2, window.innerHeight/2);
    } catch (error) {
      alert('Failed to send message.');
    }
  }

  async sendHeart() {
    try {
      const messagesRef = collection(db, 'conversations', this.conversationId, 'messages');
      await addDoc(messagesRef, {
        senderId: currentUser.uid,
        text: '❤️',
        createdAt: serverTimestamp(),
        type: 'heart'
      });
      for (let i = 0; i < 5; i++) {
        setTimeout(() => createHeartAnimation(Math.random()*window.innerWidth, Math.random()*window.innerHeight), i*200);
      }
    } catch (error) {
      console.error('Error sending heart:', error);
    }
  }

  displayMessage(messageData, messageId) {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${messageData.senderId === currentUser.uid ? 'own' : 'other'}`;

    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';

    if (messageData.type === 'heart') {
      bubble.innerHTML = `<div class="heart-message">${messageData.text}</div><div class="message-time">${formatTimestamp(messageData.createdAt)}</div>`;
    } else {
      bubble.innerHTML = `<div class="message-text">${messageData.text}</div><div class="message-time">${formatTimestamp(messageData.createdAt)}</div>`;
    }

    messageElement.appendChild(bubble);
    this.chatMessages.appendChild(messageElement);
  }

  scrollToBottom() {
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  }
}

document.addEventListener('DOMContentLoaded', () => new ChatManager());
