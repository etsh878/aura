const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[c]));
let data=null;
function toast(msg){const el=$('#adminToast');el.textContent=msg;el.classList.add('show');clearTimeout(window.__t);window.__t=setTimeout(()=>el.classList.remove('show'),1900)}
function itemTemplate(item,ci,ii){
  const t=item.type||'single';
  let specific='';
  if(t==='single') specific=`<div class="type-specific"><input data-field="price" type="number" min="0" step="1" value="${esc(item.price??0)}" placeholder="السعر"></div>`;
  else if(t==='sizes') specific=`<div class="type-specific"><input data-size="S" type="number" min="0" value="${esc(item.prices?.S??0)}" placeholder="S"><input data-size="D" type="number" min="0" value="${esc(item.prices?.D??0)}" placeholder="D"></div>`;
  else specific=`<div class="type-specific variant-box">${(item.variants||[]).map((v,vi)=>`<div class="variant-row"><input data-variant-name="${vi}" value="${esc(v.name)}" placeholder="الخيار"><input data-variant-price="${vi}" type="number" min="0" value="${esc(v.price??0)}" placeholder="السعر"><button type="button" class="item-delete" data-remove-variant="${vi}">×</button></div>`).join('')}<button type="button" class="mini-btn" data-add-variant>+ خيار</button></div>`;
  return `<div class="item-editor" data-ci="${ci}" data-ii="${ii}">
    <input data-field="name" value="${esc(item.name)}" dir="ltr" placeholder="اسم الصنف">
    <select data-field="type"><option value="single" ${t==='single'?'selected':''}>سعر واحد</option><option value="sizes" ${t==='sizes'?'selected':''}>S / D</option><option value="variants" ${t==='variants'?'selected':''}>اختيارات</option></select>
    <label class="available-wrap"><input data-field="available" type="checkbox" ${item.available!==false?'checked':''}> متاح</label>
    ${specific}
    <button type="button" class="item-delete" data-remove-item>حذف</button>
  </div>`;
}
function renderEditor(){
  $('#editor').innerHTML=(data.categories||[]).map((c,ci)=>`<div class="category-editor" data-ci="${ci}">
    <div class="category-head"><div class="drag-dot"></div><input data-category-name value="${esc(c.name)}"><div class="cat-actions"><button type="button" class="mini-btn" data-add-item>+ صنف</button><button type="button" class="mini-btn danger" data-remove-category>حذف القسم</button></div></div>
    <div class="items-editor">${(c.items||[]).map((item,ii)=>itemTemplate(item,ci,ii)).join('')}<div class="add-item-row"><button type="button" class="outline-btn" data-add-item>+ إضافة صنف</button></div></div>
  </div>`).join('') || '<div class="empty-state">مفيش أقسام. ضيف أول قسم من فوق.</div>';
}
function fillSettings(){const s=data.settings||{};$('#brandField').value=s.brand||'';$('#taglineField').value=s.tagline||'';$('#subtaglineField').value=s.subtagline||'';$('#igField').value=s.socials?.instagram||'';$('#ttField').value=s.socials?.tiktok||'';$('#fbField').value=s.socials?.facebook||'';$('#mapsField').value=s.socials?.maps||'';}
function syncSettings(){data.settings=data.settings||{};data.settings.brand=$('#brandField').value.trim();data.settings.tagline=$('#taglineField').value.trim();data.settings.subtagline=$('#subtaglineField').value.trim();data.settings.socials={instagram:$('#igField').value.trim(),tiktok:$('#ttField').value.trim(),facebook:$('#fbField').value.trim(),maps:$('#mapsField').value.trim()}}
function bindEditor(){
  $('#editor').addEventListener('input',e=>{
    const cat=e.target.closest('.category-editor'); const item=e.target.closest('.item-editor');
    if(cat){const ci=Number(cat.dataset.ci); if(e.target.matches('[data-category-name]')) data.categories[ci].name=e.target.value;}
    if(item){const ci=Number(item.dataset.ci), ii=Number(item.dataset.ii), obj=data.categories[ci].items[ii];
      if(e.target.matches('[data-field="name"]')) obj.name=e.target.value;
      if(e.target.matches('[data-field="price"]')) obj.price=Number(e.target.value||0);
      if(e.target.matches('[data-size="S"]')){obj.prices=obj.prices||{};obj.prices.S=Number(e.target.value||0)}
      if(e.target.matches('[data-size="D"]')){obj.prices=obj.prices||{};obj.prices.D=Number(e.target.value||0)}
      const vn=e.target.closest('[data-variant-name]'); if(vn){const vi=Number(vn.dataset.variantName);obj.variants=obj.variants||[];if(obj.variants[vi])obj.variants[vi].name=e.target.value}
      const vp=e.target.closest('[data-variant-price]'); if(vp){const vi=Number(vp.dataset.variantPrice);obj.variants=obj.variants||[];if(obj.variants[vi])obj.variants[vi].price=Number(e.target.value||0)}
    }
  });
  $('#editor').addEventListener('change',e=>{
    const item=e.target.closest('.item-editor'); if(!item)return;
    const ci=Number(item.dataset.ci),ii=Number(item.dataset.ii),obj=data.categories[ci].items[ii];
    if(e.target.matches('[data-field="type"]')){obj.type=e.target.value;if(e.target.value==='single'){delete obj.prices;delete obj.variants;obj.price=obj.price||0}else if(e.target.value==='sizes'){delete obj.price;delete obj.variants;obj.prices=obj.prices||{S:0,D:0}}else{delete obj.price;delete obj.prices;obj.variants=obj.variants||[{name:'Option 1',price:0}]};renderEditor()}
    if(e.target.matches('[data-field="available"]'))obj.available=e.target.checked;
  });
  $('#editor').addEventListener('click',e=>{
    const cat=e.target.closest('.category-editor'), item=e.target.closest('.item-editor');
    if(e.target.matches('[data-add-item]')){const ci=Number(cat.dataset.ci);data.categories[ci].items.push({name:'صنف جديد',available:true,type:'single',price:0});renderEditor();return}
    if(e.target.matches('[data-remove-category]')){const ci=Number(cat.dataset.ci);if(confirm('تحذف القسم بكل أصنافه؟')){data.categories.splice(ci,1);renderEditor()}return}
    if(e.target.matches('[data-remove-item]')){const ci=Number(item.dataset.ci),ii=Number(item.dataset.ii);data.categories[ci].items.splice(ii,1);renderEditor();return}
    if(e.target.matches('[data-add-variant]')){const ci=Number(item.dataset.ci),ii=Number(item.dataset.ii);data.categories[ci].items[ii].variants.push({name:'خيار جديد',price:0});renderEditor();return}
    if(e.target.matches('[data-remove-variant]')){const ci=Number(item.dataset.ci),ii=Number(item.dataset.ii),vi=Number(e.target.dataset.removeVariant);data.categories[ci].items[ii].variants.splice(vi,1);renderEditor();}
  });
}
function saveLocal(){syncSettings();localStorage.setItem('aura-menu-preview',JSON.stringify(data));toast('اتحفظت التعديلات على الجهاز ✓')}
function downloadJson(){syncSettings();const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json;charset=utf-8'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='menu.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500)}
async function boot(){
  const cfg=window.AURA_ADMIN_CONFIG||{pin:'6548944'};
  const open=()=>{$('#loginGate').classList.add('hidden');$('#adminApp').classList.remove('hidden');document.body.classList.add('admin-ready')};
  $('#pinBtn').addEventListener('click',()=>{if($('#pinInput').value===String(cfg.pin)){sessionStorage.setItem('aura-admin-ok','1');open()}else $('#pinError').textContent='PIN غير صحيح'});
  $('#pinInput').addEventListener('keydown',e=>{if(e.key==='Enter')$('#pinBtn').click()});
  $('#logoutBtn').addEventListener('click',()=>{sessionStorage.removeItem('aura-admin-ok');location.reload()});
  if(sessionStorage.getItem('aura-admin-ok')!=='1'){return}
  open();
  try{const embedded=window.AURA_MENU_DATA||null;const res=await fetch(`data/menu.json?ts=${Date.now()}`,{cache:'no-store'});data=res.ok?await res.json():(embedded||{version:1,settings:{},categories:[]})}catch{data=window.AURA_MENU_DATA||{version:1,settings:{},categories:[]}}
  fillSettings();renderEditor();bindEditor();
  $('#saveLocalBtn').addEventListener('click',saveLocal);$('#downloadBtn').addEventListener('click',downloadJson);
  $('#addCategoryBtn').addEventListener('click',()=>{data.categories.push({id:`category-${Date.now()}`,name:'قسم جديد',icon:'coffee',items:[]});renderEditor()});
  $$('#brandField,#taglineField,#subtaglineField,#igField,#ttField,#fbField,#mapsField').forEach(el=>el.addEventListener('input',syncSettings));
}
boot();
