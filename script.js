const birthday = new Date(new Date().getFullYear(), 9, 23, 0, 0, 0);
if (new Date() > birthday) birthday.setFullYear(birthday.getFullYear()+1);

function $(id){return document.getElementById(id)}
function scrollToId(id){document.getElementById(id).scrollIntoView({behavior:'smooth'})}

function updateCountdown(){
  const now=new Date(), diff=birthday-now;
  const d=Math.max(0,Math.floor(diff/86400000));
  const h=Math.max(0,Math.floor(diff/3600000)%24);
  const m=Math.max(0,Math.floor(diff/60000)%60);
  const s=Math.max(0,Math.floor(diff/1000)%60);
  $('days').textContent=String(d).padStart(2,'0');
  $('hours').textContent=String(h).padStart(2,'0');
  $('minutes').textContent=String(m).padStart(2,'0');
  $('seconds').textContent=String(s).padStart(2,'0');
}
setInterval(updateCountdown,1000); updateCountdown();

const todayKey=()=>new Date().toISOString().slice(0,10);
let state=JSON.parse(localStorage.getItem('mushiQuest')||'{"streak":0,"last":"","claimed":[],"clues":0}');
function save(){localStorage.setItem('mushiQuest',JSON.stringify(state))}
function renderStreak(){
  $('streak').textContent=state.streak;
  $('claimBtn').disabled=state.last===todayKey();
  $('claimBtn').textContent=state.last===todayKey()?'MISSION CLAIMED ✓':'CLAIM TODAY\\'S MISSION';
  $('claimBtn').style.opacity=state.last===todayKey()?.55:1;
  const messages=[
    "CLUE 1 // Your Bunny is hiding something.",
    "CLUE 2 // Pack something warm.",
    "CLUE 3 // There will be mountains.",
    "CLUE 4 // The destination has a view worth remembering.",
    "CLUE 5 // You won't be told the name yet.",
    "CLUE 6 // Bunny knows. Chiggy knows. Mochi definitely knows.",
    "FINAL CLUE // 23 OCT unlocks the destination."
  ];
  const grid=$('revealGrid'); grid.innerHTML='';
  for(let i=0;i<21;i++){
    const x=document.createElement('div'); x.className='reveal '+(i<state.streak?'claimed':'');
    x.textContent=i<state.streak?`DAY ${i+1} ✓`:`DAY ${i+1}`;
    grid.appendChild(x);
  }
  $('clueText').textContent=`CLUE ${Math.min(state.clues,7)} // `+(messages[Math.max(0,Math.min(state.clues,7)-1)]||"CLASSIFIED");
}
$('claimBtn').onclick=()=>{
  if(state.last===todayKey()) return;
  state.streak++; state.last=todayKey(); state.clues=Math.min(7,state.streak); save(); renderStreak();
  toast(state.streak>=7?"NEW CLUE UNLOCKED. Bunny is getting suspiciously excited.":"STREAK SAVED. Come back tomorrow, King.");
};
renderStreak();

document.querySelectorAll('.game-tab').forEach(btn=>btn.onclick=()=>{
 document.querySelectorAll('.game-tab').forEach(x=>x.classList.remove('active'));btn.classList.add('active');
 ['code','mood','king'].forEach(g=>$(g+'Game').classList.toggle('hidden',g!==btn.dataset.game));
});
function checkCode(){
 const v=$('codeInput').value.trim().toLowerCase();
 if(v==='mushi'||v==='mushi') { $('codeResult').textContent='ACCESS GRANTED. Bunny says: I LOVE YOU, MUSHI. ♡'; confetti(); }
 else $('codeResult').textContent='ACCESS DENIED. Hint: your Bunny\\'s favourite nickname for you.';
}
function submitMood(){
 const v=+$('mood').value;
 $('moodResult').textContent=v>80?'KING DETECTED. Bunny approves. 👑':v>55?'Pretty good. Bunny is sending you a virtual hug. ♡':'Emergency Bunny protocol activated. Come here.';
}
let bossRunning=false,hits=0,time=15,timerId;
$('startBoss').onclick=()=>{
 if(bossRunning)return;
 bossRunning=true;hits=0;time=15;$('hitCount').textContent='HITS: 0';$('timer').textContent=time;$('bossResult').textContent='';
 moveBoss();
 timerId=setInterval(()=>{time--;$('timer').textContent=time;if(time<=0){clearInterval(timerId);bossRunning=false;$('bossResult').textContent=hits>=10?'BOSS DEFEATED. PRIZE UNLOCKED: ONE VERY HAPPY BUNNY.':'The evil king escaped. Try again, hero.'}},1000);
};
$('boss').onclick=()=>{if(!bossRunning)return;hits++;$('hitCount').textContent='HITS: '+hits;moveBoss();if(hits>=15){clearInterval(timerId);bossRunning=false;$('bossResult').textContent='CRITICAL HIT. YOU WIN: A REAL-LIFE BIRTHDAY REWARD. ♡'}};
function moveBoss(){const a=$('arena'),b=$('boss');b.style.left=(5+Math.random()*85)+'%';b.style.top=(15+Math.random()*65)+'%'}
function triggerScare(){$('scare').classList.remove('hidden');setTimeout(()=>{$('scare').querySelector('.scare-text').textContent='OKAY OKAY. HAPPY BOYFRIEND\\'S DAY, MUSHI. ♡'},1700)}
function closeScare(){$('scare').classList.add('hidden')}
function toast(msg){const t=$('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2600)}
function confetti(){for(let i=0;i<30;i++){const d=document.createElement('div');d.textContent=Math.random()>.5?'♡':'✦';d.style.cssText=`position:fixed;left:${Math.random()*100}vw;top:-20px;color:#ff3d61;font-size:${12+Math.random()*22}px;z-index:90;transition:transform 2s linear,opacity 2s;`;document.body.appendChild(d);requestAnimationFrame(()=>d.style.transform=`translateY(${100+Math.random()*100}vh) rotate(${Math.random()*500}deg)`);setTimeout(()=>d.remove(),2200)}}
const song=$('song'), musicBtn=$('musicBtn');
musicBtn.onclick=async()=>{try{if(song.paused){await song.play();musicBtn.textContent='♫ AJAB SI: ON'}else{song.pause();musicBtn.textContent='♫ AJAB SI: OFF'}}catch(e){toast('Add assets/ajab-si.mp3 first, then press play.')}};
document.addEventListener('pointermove',e=>{$('cursorGlow').style.left=e.clientX+'px';$('cursorGlow').style.top=e.clientY+'px'});
// Gentle surprise on long scrolling
let lastY=scrollY; window.addEventListener('scroll',()=>{if(Math.abs(scrollY-lastY)>1200 && Math.random()<.12) toast('CHIGGY AND MOCHI ARE WATCHING. 👀');lastY=scrollY});
