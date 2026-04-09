const PRODUCTS=[
  {id:1,name:'Silk Wrap Blouse',cat:'tops',price:899,emoji:'👚',bg:'#F5EDE3',badge:'bestseller',tags:['silk','blouse','wrap']},
  {id:2,name:'Tailored Linen Trousers',cat:'bottoms',price:1299,emoji:'👖',bg:'#E8EDF0',badge:'new',tags:['linen','trousers','tailored']},
  {id:3,name:'Cashmere Turtleneck',cat:'tops',price:1599,emoji:'🧥',bg:'#EDE8E3',badge:null,tags:['cashmere','turtleneck','knit']},
  {id:4,name:'Wide-Leg Culottes',cat:'bottoms',price:799,emoji:'👗',bg:'#EEF0E8',badge:'sale',originalPrice:1199,tags:['culottes','wide-leg','summer']},
  {id:5,name:'Structured Wool Coat',cat:'outerwear',price:2499,emoji:'🧥',bg:'#E8E3ED',badge:'new',tags:['wool','coat','structured']},
  {id:6,name:'Gold Hoop Earrings',cat:'accessories',price:399,emoji:'💛',bg:'#F5F0E3',badge:'bestseller',tags:['gold','earrings','hoop']},
  {id:7,name:'Leather Mini Skirt',cat:'bottoms',price:1199,emoji:'🩱',bg:'#EDEBE8',badge:null,tags:['leather','skirt','mini']},
  {id:8,name:'Merino Cardigan',cat:'tops',price:999,emoji:'🧶',bg:'#E3EDE8',badge:null,tags:['merino','cardigan','knitwear']},
  {id:9,name:'Suede Crossbody Bag',cat:'accessories',price:1799,emoji:'👜',bg:'#EDE3E3',badge:'new',tags:['suede','bag','crossbody']},
  {id:10,name:'Classic Trench Coat',cat:'outerwear',price:1999,emoji:'🧤',bg:'#E8EDE3',badge:'bestseller',tags:['trench','coat','classic']},
  {id:11,name:'Silk Slip Dress',cat:'tops',price:1099,emoji:'👗',bg:'#F0E8ED',badge:'sale',originalPrice:1599,tags:['silk','dress','slip']},
  {id:12,name:'Pearl Drop Necklace',cat:'accessories',price:599,emoji:'🤍',bg:'#F0F0F0',badge:null,tags:['pearl','necklace','drop']},
];

let cart=JSON.parse(localStorage.getItem('starLuxuryCart')||'[]');
let activeFilter='all';

function saveCart(){localStorage.setItem('starLuxuryCart',JSON.stringify(cart));}

function addToCart(id,btnEl){
  const p=PRODUCTS.find(x=>x.id===id);
  const existing=cart.find(x=>x.id===id);
  if(existing){existing.qty++;}else{cart.push({...p,qty:1});}
  saveCart();updateCartCount();
  btnEl.classList.add('added');btnEl.textContent='✓';
  setTimeout(()=>{btnEl.classList.remove('added');btnEl.textContent='+';},1200);
  renderCartItems();
}

function updateCartCount(){
  const total=cart.reduce((s,i)=>s+i.qty,0);
  document.getElementById('cartCount').textContent=total;
  document.getElementById('checkoutBtn').disabled=total===0;
}

function updateQty(id,delta){
  const item=cart.find(x=>x.id===id);
  if(!item)return;
  item.qty+=delta;
  if(item.qty<=0)cart=cart.filter(x=>x.id!==id);
  saveCart();updateCartCount();renderCartItems();
}

function removeItem(id){
  cart=cart.filter(x=>x.id!==id);
  saveCart();updateCartCount();renderCartItems();
}

function getSubtotal(){return cart.reduce((s,i)=>s+i.price*i.qty,0);}

function renderCartItems(){
  const el=document.getElementById('cartItems');
  document.getElementById('subtotal').textContent='R'+getSubtotal().toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
  if(cart.length===0){
    el.innerHTML='<div class="cart-empty"><div class="cart-empty-icon">🛍</div><p>Your selection is empty</p></div>';
    return;
  }
  el.innerHTML=cart.map(item=>`
    <div class="cart-item">
      <div class="ci-img" style="background:${item.bg}">${item.emoji}</div>
      <div class="ci-info">
        <div class="ci-name">${item.name}</div>
        <div class="ci-cat">${item.cat}</div>
        <div class="ci-bottom">
          <div class="ci-price">$${(item.price*item.qty).toLocaleString('en-US',{minimumFractionDigits:2})}</div>
          <div class="qty-ctrl">
            <button class="qty-btn" onclick="updateQty(${item.id},-1)">−</button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-btn" onclick="updateQty(${item.id},1)">+</button>
            <button class="remove-btn" onclick="removeItem(${item.id})">×</button>
          </div>
        </div>
      </div>
    </div>`).join('');
}

function setFilter(cat,btn){
  activeFilter=cat;
  document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  renderProducts();
}

function renderProducts(){
  const query=document.getElementById('searchInput').value.toLowerCase();
  const sort=document.getElementById('sortSelect').value;
  let list=PRODUCTS.filter(p=>{
    const matchCat=activeFilter==='all'||p.cat===activeFilter;
    const matchQ=!query||p.name.toLowerCase().includes(query)||p.tags.some(t=>t.includes(query));
    return matchCat&&matchQ;
  });
  if(sort==='price-asc')list.sort((a,b)=>a.price-b.price);
  else if(sort==='price-desc')list.sort((a,b)=>b.price-a.price);
  else if(sort==='name')list.sort((a,b)=>a.name.localeCompare(b.name));
  document.getElementById('productCount').textContent=list.length;
  const grid=document.getElementById('productGrid');
  if(list.length===0){grid.innerHTML='<div class="no-results">No items found</div>';return;}
  grid.innerHTML=list.map(p=>{
    const badgeHtml=p.badge?`<div class="badge ${p.badge}">${p.badge}</div>`:'';
    const priceHtml=p.originalPrice
      ?`<span class="price">$${p.price}</span><span class="price-old">$${p.originalPrice}</span>`
      :`<span class="price">$${p.price}</span>`;
    return`<div class="product-card">
      <div class="product-img" style="background:${p.bg}">${p.emoji}${badgeHtml}</div>
      <div class="product-info">
        <div class="product-cat">${p.cat}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-bottom">
          <div>${priceHtml}</div>
          <button class="add-btn" onclick="addToCart(${p.id},this)">+</button>
        </div>
      </div>
    </div>`;
  }).join('');
}

function openCart(){
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('overlay').classList.add('open');
}
function closeCart(){
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('overlay').classList.remove('open');
}

function openCheckout(){
  closeCart();
  const summary=document.getElementById('orderSummary');
  const shipping=getSubtotal()>=1500?0:12;
  const lines=cart.map(i=>`<div class="order-line"><span>${i.name} × ${i.qty}</span><span>$${(i.price*i.qty).toFixed(2)}</span></div>`).join('');
  summary.innerHTML=lines+
    `<div class="order-line"><span>Shipping</span><span>${shipping===0?'Free':'R'+shipping.toFixed(2)}</span></div>`+
    `<div class="order-line total"><span>Total</span><span>$${(getSubtotal()+shipping).toFixed(2)}</span></div>`;
  document.getElementById('checkoutForm').style.display='';
  document.getElementById('successScreen').classList.remove('show');
  document.getElementById('modalOverlay').classList.add('open');
}
function closeCheckout(){document.getElementById('modalOverlay').classList.remove('open');}

function selectPay(el){
  document.querySelectorAll('.pay-method').forEach(e=>e.classList.remove('active'));
  el.classList.add('active');
}

function placeOrder(){
  const code='SLB-'+Math.random().toString(36).slice(2,8).toUpperCase();
  document.getElementById('orderCode').textContent='Order #'+code;
  document.getElementById('checkoutForm').style.display='none';
  document.getElementById('successScreen').classList.add('show');
  cart=[];saveCart();updateCartCount();renderCartItems();
}

renderProducts();
updateCartCount();
renderCartItems();