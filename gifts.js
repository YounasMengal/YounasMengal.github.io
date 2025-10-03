const gifts = [
  'You are my sunshine 🌞',
  'Forever together ❤️',
  'I love you endlessly 💕',
  'Surprise Hug 🤗',
  'A secret poem: Roses are red...'
];

document.getElementById('reveal').addEventListener('click', ()=>{
  const q = document.getElementById('question').value.trim().toLowerCase();
  let msg = gifts[Math.floor(Math.random()*gifts.length)];
  if(q.includes('love')) msg = 'I love you more than words can say ❤️';
  document.getElementById('gift').textContent = msg;
});