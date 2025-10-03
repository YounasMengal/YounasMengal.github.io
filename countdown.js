const items = [
  {name:'Mengal Birthday', date:'2025-04-27'},
  {name:'Zainee Birthday', date:'2025-03-04'},
  {name:'Anniversary', date:'2025-09-15'}
];

function daysUntil(d){
  const now = new Date();
  let target = new Date(d);
  target.setFullYear(now.getFullYear());
  if(target < now) target.setFullYear(now.getFullYear()+1);
  return Math.ceil((target - now)/(1000*60*60*24));
}

const container = document.getElementById('countdowns');
items.forEach(it => {
  const p = document.createElement('p');
  p.textContent = it.name + ': ' + daysUntil(it.date) + ' days';
  container.appendChild(p);
});