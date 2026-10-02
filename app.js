const state = {
  data: null,
  activeCategory: 'all',
  query: '',
};

const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const money = (n) => `${Number(n || 0).toLocaleString('en-US')} EGP`;
const esc = (s='') => String(s).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[c]));
function icon(name){return `<svg><use href="#i-${name}"></use></svg>`}

async function loadMenu(){
  const preview = new URLSearchParams(location.search).get('preview') === '1';
  if(preview){
    try{const local = JSON.parse(localStorage.getItem('aura-menu-preview')||'null'); if(local) return local;}catch{}
  }

  const embedded = window.AURA_MENU_DATA || null;
  if(location.protocol === 'file:') return embedded || (()=>{throw new Error('Embedded menu data missing')})();

  try{
    const res = await fetch(`data/menu.json?ts=${Date.now()}`, {cache:'no-store'});
    if(res.ok) return await res.json();
    throw new Error('menu.json failed');
  }catch(err){
    if(embedded) return embedded;
    throw err;
  }
}

function initHeader(){
  const s=state.data.settings || {};
  $('#brandTitle').textContent=s.brand || 'AURA MENU';
  $('#tagline').textContent=s.tagline || 'Coffee • Drinks • Desserts';
  $('#subtagline').textContent=s.subtagline || 'اتفرّج على المنيو واختار طلبك، وبلّغ الويتر بطلبك.';
  $('#locationBtn').href=s.socials?.maps || '#';
  const socials=[['instagram','instagram'],['tiktok','tiktok'],['facebook','facebook'],['maps','pin']];
  const renderSocials=(root)=>{root.innerHTML=socials.filter(([k])=>s.socials?.[k]).map(([k,ic])=>`<a class="social-btn" href="${esc(s.socials[k])}" target="_blank" rel="noopener" aria-label="${k}">${icon(ic)}</a>`).join('')};
  renderSocials($('#socialRow')); renderSocials($('#footerLinks'));
}

function renderCategoryNav(){
  const nav=$('#categoryNav');
  const cats=[{id:'all',name:'الكل',icon:'coffee'},...(state.data.categories||[])];
  nav.innerHTML=cats.map(c=>`<button class="category-btn ${state.activeCategory===c.id?'active':''}" data-category="${esc(c.id)}" role="tab" aria-selected="${state.activeCategory===c.id}">${icon(c.icon || 'coffee')}<span>${esc(c.name)}</span></button>`).join('');
  $$('.category-btn',nav).forEach(btn=>btn.addEventListener('click',()=>{
    state.activeCategory=btn.dataset.category;
    renderCategoryNav(); renderMenu();
    if(state.activeCategory!=='all') document.getElementById(state.activeCategory)?.scrollIntoView({behavior:'smooth',block:'start'});
  }));
}

function itemMatches(item){
  if(!state.query) return true;
  return item.name.toLowerCase().includes(state.query.toLowerCase());
}
function filteredCategories(){
  return (state.data.categories||[])
    .filter(c=>state.activeCategory==='all' || c.id===state.activeCategory)
    .map(c=>({...c,items:c.items.filter(i=>itemMatches(i))}))
    .filter(c=>c.items.length);
}

function priceView(item){
  if(item.type==='single') return `<div class="item-actions"><div class="single-price">${money(item.price)}</div></div>`;
  if(item.type==='sizes') return `<div class="item-actions"><div class="option-row">${Object.entries(item.prices||{}).map(([k,p])=>`<div class="option-btn"><span>${esc(k)}</span><span>${money(p)}</span></div>`).join('')}</div></div>`;
  if(item.type==='variants') return `<div class="item-actions"><div class="option-row">${(item.variants||[]).map(v=>`<div class="option-btn"><span>${esc(v.name)}</span><span>${money(v.price)}</span></div>`).join('')}</div></div>`;
  return '';
}

function renderMenu(){
  const content=$('#menuContent');
  const cats=filteredCategories();
  let visible=0;
  content.innerHTML=cats.map(cat=>{
    visible += cat.items.length;
    return `<section class="menu-section" id="${esc(cat.id)}">
      <div class="section-title-row"><div class="section-title"><div class="section-icon">${icon(cat.icon||'coffee')}</div><h3>${esc(cat.name)}</h3></div><span class="section-count">${cat.items.length} أصناف</span></div>
      <div class="item-grid">${cat.items.map(item=>{
        return `<article class="menu-card"><div class="item-meta"><div class="item-name" dir="ltr">${esc(item.name)}</div></div>${priceView(item)}</article>`;
      }).join('')}</div>
    </section>`;
  }).join('');
  $('#resultCount').textContent = visible ? `${visible} صنف` : '';
  $('#emptyState').classList.toggle('hidden', cats.length>0);
}

function revealApp(){
  const loader=$('#loader');
  const app=$('#app');
  requestAnimationFrame(()=>{
    loader.classList.add('is-done');
    app.classList.remove('hidden');
    app.classList.add('is-visible');
  });
}

async function boot(){
  try{
    state.data=await loadMenu();
    initHeader();
    renderCategoryNav();
    renderMenu();
    $('#searchInput').addEventListener('input',e=>{state.query=e.target.value.trim();renderMenu()});
    if('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(()=>{});
    setTimeout(revealApp, 1050);
  }catch(err){
    console.error(err);
    $('#loader').innerHTML='<div class="loader-card"><div class="loader-logo-wrap"><img src="assets/aura-logo.png" alt="AURA"></div><div class="loader-wordmark">AURA MENU</div><div class="loader-caption" style="margin-top:10px">تعذر تحميل المنيو. تأكد من وجود ملفات المنيو كاملة.</div></div>';
    $('#app').classList.remove('hidden');
    $('#app').classList.add('is-visible');
  }
}
boot();
