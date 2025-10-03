import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getDatabase, ref, set, get, onValue, update } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";
import "../firebase-config.js";

const app = initializeApp(window.firebaseConfig);
const db = getDatabase(app);
const meFull = localStorage.getItem('user') || 'guest';
const me = meFull.split('@')[0] || meFull;
const TTT = ref(db, 'games/tictactoe/mengal_zainee');
const RPS = ref(db, 'games/rps/mengal_zainee');
const area = document.getElementById('gameArea');

function createBoardUI(board){
  area.innerHTML = '<div id="tttBoard" style="display:grid;grid-template-columns:repeat(3,80px);gap:8px;margin-top:12px"></div><div id="tttStatus" style="margin-top:8px"></div>';
  const boardEl = document.getElementById('tttBoard');
  board.forEach((val,i)=>{
    const cell = document.createElement('div');
    cell.textContent = val || '';
    cell.style.width='80px';cell.style.height='80px';cell.style.display='flex';cell.style.alignItems='center';cell.style.justifyContent='center';
    cell.style.fontSize='28px';cell.style.background='#fff';cell.style.borderRadius='8px';cell.style.cursor='pointer';
    cell.dataset.idx = i;
    cell.addEventListener('click', ()=> makeMove(i));
    boardEl.appendChild(cell);
  });
}

function checkWinner(board){
  const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for(const [a,b,c] of lines){
    if(board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  if(board.every(Boolean)) return 'draw';
  return null;
}

async function makeMove(idx){
  const snap = await get(TTT);
  const data = snap.val();
  if(!data) return;
  const board = data.board || ['','','','','','','','',''];
  const turn = data.turn;
  const players = data.players || {};
  const winner = data.winner;
  if(winner) return;
  const symbol = players && players.X === me ? 'X' : (players && players.O === me ? 'O' : null);
  if(!symbol) return;
  if(turn !== symbol) return;
  if(board[idx]) return;
  board[idx] = symbol;
  const win = checkWinner(board);
  const next = symbol === 'X' ? 'O' : 'X';
  await update(TTT, {board:board, turn:next, winner: win ? (win === 'draw' ? 'draw' : (win === 'X' ? players.X : players.O)) : null});
}

async function claimSlot(){
  const snap = await get(TTT);
  const data = snap.val() || {};
  const players = data.players || {};
  if(!players.X){
    await update(TTT, {players:{...(players), X:me}});
  } else if(!players.O && players.X !== me){
    await update(TTT, {players:{...(players), O:me}});
  }
}

// initialize TTT game if not present
onValue(TTT, snap => {
  const data = snap.val();
  if(!data){
    set(TTT, {board:['','','','','','','','',''], turn:'X', players:{}, winner:null});
    return;
  }
  const board = data.board;
  createBoardUI(board);
  const status = document.getElementById('tttStatus');
  status.textContent = data.winner ? 'Winner: ' + data.winner : 'Turn: ' + data.turn + ' | Players: X=' + (data.players?.X||'—') + ' O=' + (data.players?.O||'—');
});

// RPS implementation
onValue(RPS, snap => {
  const data = snap.val();
  if(!data){
    set(RPS, {mengal:null, zainee:null, result:null});
    return;
  }
  // render RPS UI
  const rpsEl = document.createElement('div');
  rpsEl.innerHTML = '<div style="margin-top:12px"><button id="rock">Rock</button><button id="paper">Paper</button><button id="scissors">Scissors</button></div><div id="rpsStatus" style="margin-top:8px"></div>';
  area.appendChild(rpsEl);
  document.getElementById('rock').onclick = ()=> chooseRPS('rock');
  document.getElementById('paper').onclick = ()=> chooseRPS('paper');
  document.getElementById('scissors').onclick = ()=> chooseRPS('scissors');
  const status = document.getElementById('rpsStatus');
  if(data.mengal && data.zainee){
    const res = decideRPS(data.mengal, data.zainee);
    update(RPS, {result:res});
    status.textContent = 'Mengal: ' + data.mengal + ' | Zainee: ' + data.zainee + ' | Result: ' + res;
  } else {
    status.textContent = 'Waiting for both players...';
  }
});

function chooseRPS(choice){
  const key = me.includes('mengal') ? 'mengal' : 'zainee';
  update(RPS, {[key]: choice});
}

function decideRPS(a,b){
  if(a===b) return 'Draw';
  if((a==='rock'&&b==='scissors')||(a==='paper'&&b==='rock')||(a==='scissors'&&b==='paper')) return 'Mengal';
  return 'Zainee';
}

// Buttons handler
document.getElementById('tttBtn').addEventListener('click', async ()=>{
  area.innerHTML = '';
  await claimSlot();
  onValue(TTT, snap => {
    const data = snap.val();
    if(data){
      createBoardUI(data.board);
      const s = document.getElementById('tttStatus') || document.createElement('div');
      s.id = 'tttStatus';
      s.textContent = data.winner ? 'Winner: ' + data.winner : 'Turn: ' + data.turn;
      area.appendChild(s);
    }
  }, {onlyOnce:false});
});

document.getElementById('rpsBtn').addEventListener('click', ()=>{
  area.innerHTML = '';
  onValue(RPS, ()=>{});
});
