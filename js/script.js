const WHATSAPP_NUMBER = "6283132473928"; // GANTI dengan nomor WhatsApp Fadli Store

const products = [
  {id:1,name:"Editing Video Premium",category:"editing",price:75000,badge:"Best Seller",icon:"fa-film",time:"1–2 hari",revision:"2x revisi",desc:"Editing video profesional dengan kualitas terbaik, cocok untuk YouTube, TikTok, Instagram, dan lainnya."},
  {id:2,name:"Editing Reels / TikTok",category:"editing",price:50000,badge:"Popular",icon:"fa-mobile-screen-button",time:"1 hari",revision:"1x revisi",desc:"Video pendek yang dinamis untuk Reels, TikTok, Shorts, dan konten sosial media."},
  {id:3,name:"Desain Thumbnail",category:"desain",price:50000,badge:"Popular",icon:"fa-image",time:"1 hari",revision:"2x revisi",desc:"Thumbnail menarik dan clickable untuk YouTube, gaming, dan kebutuhan sosial media."},
  {id:4,name:"Desain Logo",category:"desain",price:75000,badge:"Premium",icon:"fa-pen-nib",time:"2–3 hari",revision:"3x revisi",desc:"Logo profesional sesuai identitas brand, lengkap dengan konsep visual yang kuat."},
  {id:5,name:"Desain Poster / Banner",category:"desain",price:60000,badge:"New",icon:"fa-object-group",time:"1–2 hari",revision:"2x revisi",desc:"Desain poster dan banner untuk promosi, event, bisnis, maupun sosial media."},
  {id:6,name:"Montage Gusion Basic",category:"montage",price:75000,badge:"",icon:"fa-gamepad",time:"2–3 hari",revision:"1x revisi",desc:"Montage Gusion Mobile Legends dengan beat sync dan transisi yang clean."},
  {id:7,name:"Montage Gusion Premium",category:"montage",price:100000,badge:"Best Seller",icon:"fa-gamepad",time:"2–4 hari",revision:"2x revisi",desc:"Montage Gusion dengan efek keren, beat sync, color grading, dan kualitas HD."},
  {id:8,name:"Montage Gusion Cinematic",category:"montage",price:150000,badge:"Pro",icon:"fa-bolt",time:"3–5 hari",revision:"3x revisi",desc:"Montage Gusion cinematic dengan storytelling, sound design, efek premium, dan hasil standout."}
];

let cart = JSON.parse(localStorage.getItem("fadliStoreCart") || "[]");
let activeFilter = "all";
let selectedProduct = null;

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const rupiah = n => new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(n).replace(/\s/g,"");

function saveCart(){localStorage.setItem("fadliStoreCart",JSON.stringify(cart));}
function productById(id){return products.find(p=>p.id===Number(id));}
function totalCart(){return cart.reduce((sum,item)=>sum + item.price*item.qty,0);}
function toast(msg){const el=$("#toast");el.querySelector("span").textContent=msg;el.classList.add("show");clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>el.classList.remove("show"),2400);}

function renderProducts(){
  const q=$("#searchInput").value.toLowerCase().trim();
  const list=products.filter(p=>(activeFilter==="all"||p.category===activeFilter)&&(`${p.name} ${p.category} ${p.desc}`.toLowerCase().includes(q)));
  $("#productGrid").innerHTML=list.map(p=>{
    const visualClass=p.category==="desain"?"purple":p.category==="montage"?"cyan":"";
    return `<article class="product-card reveal visible">
      <div class="product-visual ${visualClass}">
        ${p.badge?`<span class="badge">${p.badge}</span>`:""}<i class="fa-solid ${p.icon}"></i>
      </div>
      <div class="product-body">
        <span class="eyebrow">${p.category==="montage"?"MONTAGE Gusion":p.category.toUpperCase()}</span>
        <h3>${p.name}</h3><p>${p.desc}</p>
        <div class="product-price">${rupiah(p.price)}</div>
        <div class="product-actions">
          <button class="btn ghost detail-btn" data-id="${p.id}">Lihat Detail</button>
          <button class="btn primary add-btn" data-id="${p.id}">+ Keranjang</button>
        </div>
      </div>
    </article>`;
  }).join("");
  $("#emptyState").hidden=list.length>0;
}

function renderCart(){
  const count=cart.reduce((s,i)=>s+i.qty,0);
  $("#cartCount").textContent=count;
  $("#cartItems").innerHTML=cart.map(item=>{
    const p=productById(item.id);
    return `<div class="cart-item">
      <div class="cart-thumb"><i class="fa-solid ${p.icon}"></i></div>
      <div><h4>${p.name}</h4><p>${rupiah(p.price)}</p>
        <div class="qty"><button data-action="minus" data-id="${p.id}">−</button><span>${item.qty}</span><button data-action="plus" data-id="${p.id}">+</button></div>
      </div>
      <button class="remove" data-action="remove" data-id="${p.id}" aria-label="Hapus"><i class="fa-solid fa-trash-can"></i></button>
    </div>`;
  }).join("");
  $("#cartTotal").textContent=rupiah(totalCart());
  $("#cartEmpty").style.display=cart.length?"none":"block";
  $("#cartSummary").style.display=cart.length?"block":"none";
}

function addToCart(id,qty=1){
  const p=productById(id); if(!p)return;
  const existing=cart.find(i=>i.id===p.id);
  if(existing)existing.qty+=qty;else cart.push({id:p.id,name:p.name,price:p.price,qty});
  saveCart();renderCart();toast(`${p.name} berhasil ditambahkan ke keranjang.`);
}

function setFilter(filter){
  activeFilter=filter;
  $$(".filter").forEach(b=>b.classList.toggle("active",b.dataset.filter===filter));
  renderProducts();
  document.querySelector("#products").scrollIntoView({behavior:"smooth",block:"start"});
}

function openCart(){renderCart();$("#overlay").classList.add("show");$("#cartDrawer").classList.add("open");document.body.classList.add("no-scroll");}
function closeAll(){ $$(".drawer,.modal").forEach(x=>x.classList.remove("open","show"));$("#overlay").classList.remove("show");document.body.classList.remove("no-scroll"); }

function openProduct(id){
  const p=productById(id);selectedProduct=p;
  $("#modalBadge").textContent=p.badge||"Layanan";
  $("#modalBadge").style.display=p.badge?"inline-flex":"none";
  $("#modalCategory").textContent=p.category==="montage"?"MONTAGE Gusion":"JASA "+p.category.toUpperCase();
  $("#modalName").textContent=p.name;$("#modalDesc").textContent=p.desc;$("#modalTime").textContent=p.time;$("#modalRevision").textContent=p.revision;$("#modalPrice").textContent=rupiah(p.price);
  $("#modalVisual").innerHTML=`<i class="fa-solid ${p.icon}"></i>`;
  $("#productModal").classList.add("show");$("#overlay").classList.add("show");document.body.classList.add("no-scroll");
}

function openCheckout(){
  if(!cart.length){toast("Keranjang kamu masih kosong.");return;}
  $("#checkoutItems").innerHTML=cart.map(i=>`<div class="order-line"><span>${i.name} × ${i.qty}</span><b>${rupiah(i.price*i.qty)}</b></div>`).join("");
  $("#checkoutTotal").textContent=rupiah(totalCart());
  $("#checkoutModal").classList.add("show");$("#overlay").classList.add("show");document.body.classList.add("no-scroll");
}

function whatsappMessage(data){
  let msg=`Halo Fadli Store 👋\n\nSaya ingin melakukan pemesanan:\n\n`;
  cart.forEach((i,n)=>msg+=`${n+1}. ${i.name}\n   Qty: ${i.qty}\n   Harga: ${rupiah(i.price*i.qty)}\n\n`);
  msg+=`----------------------\nTotal: ${rupiah(totalCart())}\n\nNama: ${data.name}\nNo. WhatsApp: ${data.phone}`;
  if(data.note)msg+=`\n\nCatatan / Request:\n${data.note}`;
  msg+=`\n\nMohon informasi untuk proses selanjutnya.\nTerima kasih.`;
  return msg;
}

document.addEventListener("click",e=>{
  const add=e.target.closest(".add-btn");if(add){addToCart(add.dataset.id);return;}
  const detail=e.target.closest(".detail-btn");if(detail){openProduct(detail.dataset.id);return;}
  const filter=e.target.closest(".filter,.category-card");if(filter){setFilter(filter.dataset.filter);return;}
  const action=e.target.closest("[data-action]");if(action){
    const id=Number(action.dataset.id),item=cart.find(i=>i.id===id);
    if(!item)return;
    if(action.dataset.action==="plus")item.qty++;
    if(action.dataset.action==="minus")item.qty--;
    if(action.dataset.action==="remove"||item.qty<=0)cart=cart.filter(i=>i.id!==id);
    saveCart();renderCart();return;
  }
  if(e.target.closest("[data-close]")){closeAll();return;}
  if(e.target.closest("#openCart,#heroCart")){openCart();return;}
});

$("#modalAdd").addEventListener("click",()=>{if(selectedProduct)addToCart(selectedProduct.id);});
$("#checkoutBtn").addEventListener("click",openCheckout);
$("#checkoutForm").addEventListener("submit",e=>{
  e.preventDefault();
  const fd=new FormData(e.currentTarget);
  const data={name:String(fd.get("name")).trim(),phone:String(fd.get("phone")).trim(),note:String(fd.get("note")).trim()};
  if(!data.name||!data.phone){toast("Nama dan nomor WhatsApp wajib diisi.");return;}
  const url=`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage(data))}`;
  window.open(url,"_blank");
  cart=[];saveCart();renderCart();closeAll();e.currentTarget.reset();
});
$("#searchInput").addEventListener("input",renderProducts);
$("#overlay").addEventListener("click",closeAll);
$("#navToggle").addEventListener("click",()=>$("#navMenu").classList.toggle("open"));
$$("nav a").forEach(a=>a.addEventListener("click",()=>$("#navMenu").classList.remove("open")));
$$(".faq button").forEach(btn=>btn.addEventListener("click",()=>btn.parentElement.classList.toggle("open")));
$("#footerWa").href=`https://wa.me/${WHATSAPP_NUMBER}`;

const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add("visible")}),{threshold:.12});
$$(".reveal").forEach(el=>observer.observe(el));
renderProducts();renderCart();
