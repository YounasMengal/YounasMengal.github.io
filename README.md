Mengal ❤️ Zainee — Two-user chat package

What to do after downloading:
1. Open firebase-config.js and paste your Firebase web app config.
2. In Firebase Console:
   - Enable Authentication > Email/Password.
   - Create two users: mengal@example.com and zainee@example.com (use simple passwords for testing).
   - Enable Firestore (Native) and Realtime Database.
   - Paste firestore.rules into Firestore Rules and deploy.
   - Paste database.rules.json into Realtime Database rules and publish.
3. Open index.html, click "Login as Mengal" or "Login as Zainee". The chat uses Firestore for messages and Realtime DB for presence/typing.

Security note: This demo uses hard-coded allowed emails in security rules for simplicity. For production, use proper user management and avoid storing emails in rules in plaintext.
