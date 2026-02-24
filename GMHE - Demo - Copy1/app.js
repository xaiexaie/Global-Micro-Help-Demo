
const STORAGE_KEY = 'gmhe_posts_v1';
const USER_KEY = 'gmhe_user_v1';


const defaultUser = {name: 'You', credits: 0, reputation: 0};
function getUser(){
  return JSON.parse(localStorage.getItem(USER_KEY)) || defaultUser;
}
function saveUser(u){localStorage.setItem(USER_KEY, JSON.stringify(u));renderUser();}

function loadPosts(){
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}
function savePosts(posts){localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));}


const postsEl = document.getElementById('posts');
const form = document.getElementById('create');
const creditsEl = document.querySelector('#credits strong');
const repEl = document.querySelector('#reputation strong');

function renderUser(){const u=getUser();creditsEl.textContent=u.credits;repEl.textContent=u.reputation}

function renderPosts(){
  const posts = loadPosts();
  const q = document.getElementById('search').value.toLowerCase();
  const offersOnly = document.getElementById('filter-offers').checked;
  postsEl.innerHTML = '';
  posts.filter(p => {
    if(offersOnly && p.type!=='offer') return false;
    if(!q) return true;
    return `${p.title} ${p.tags} ${p.location}`.toLowerCase().includes(q);
  }).sort((a,b)=>b.created-a.created).forEach(p=>{
    const li=document.createElement('li');
    li.innerHTML = `
      <strong>${escapeHtml(p.title)}</strong>
      <div class="meta">${p.type} • ${p.tags || ''} • ${p.location || 'unspecified'} • ${p.duration} min</div>
      <p>${escapeHtml(p.description)}</p>
      <div class="actions">${p.claimed ? '<em>Claimed</em>' : `<button data-id="${p.id}" class="claim">Claim</button>`} ${p.claimed? (p.completed?'<button disabled>Completed</button>':'<button data-id="'+p.id+'" class="complete">Mark complete</button>') : ''}</div>
    `;
    postsEl.appendChild(li);
  });
}

function escapeHtml(s){if(!s) return '';return s.replace(/[&<>"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;" })[c]);}


form.addEventListener('submit', e=>{
  e.preventDefault();
  const posts = loadPosts();
  const id = Date.now().toString(36)+Math.random().toString(36).slice(2,6);
  const p = {
    id, type:document.getElementById('type').value, title:document.getElementById('title').value.trim(),
    description:document.getElementById('description').value.trim(), tags:document.getElementById('tags').value.trim(),
    location:document.getElementById('location').value.trim(), duration:parseInt(document.getElementById('duration').value,10)||30,
    created:Date.now(), claimed:false, completed:false
  };
  posts.push(p); savePosts(posts); renderPosts(); form.reset();
  alert('Posted! It is saved locally and will be shared when a backend is added.');
});

postsEl.addEventListener('click', e=>{
  if(e.target.matches('.claim')){
    const id = e.target.dataset.id; claimPost(id);
  }
  if(e.target.matches('.complete')){
    const id = e.target.dataset.id; completePost(id);
  }
});

function claimPost(id){
  const posts = loadPosts();
  const p = posts.find(x=>x.id===id); if(!p) return;
  p.claimed = true; p.claimedBy = getUser().name; savePosts(posts); renderPosts();
  alert('You claimed this task. When you complete it, press "Mark complete".');
}

function completePost(id){
  const posts = loadPosts();
  const p = posts.find(x=>x.id===id); if(!p) return;
  if(!p.claimed){alert('Task is not claimed.');return}
  p.completed = true; savePosts(posts); renderPosts();
  const u = getUser(); u.credits += Math.max(1, Math.round(p.duration/30)); u.reputation += 1; saveUser(u);
  alert('Marked complete — your credits and reputation updated.');
}

document.getElementById('search').addEventListener('input', renderPosts);
document.getElementById('filter-offers').addEventListener('change', renderPosts);

document.getElementById('export').addEventListener('click', ()=>{
  const data = {posts:loadPosts(), user:getUser()};
  const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='gmhe-data.json'; a.click(); URL.revokeObjectURL(url);
});

renderUser(); renderPosts();

if('serviceWorker' in navigator){
  navigator.serviceWorker.register('/sw.js').then(()=>console.log('SW registered')).catch(console.error);
}

let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e)=>{
  e.preventDefault(); deferredPrompt = e; const btn = document.createElement('button');
  btn.textContent = 'Install App'; btn.addEventListener('click', async ()=>{ deferredPrompt.prompt(); const choice = await deferredPrompt.userChoice; deferredPrompt = null; btn.remove(); });
  document.body.appendChild(btn);
});

