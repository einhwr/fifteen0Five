const products = [
  {id:1,category:"kopi",unit:"gelas",name:"Ice Americano",description:"Espresso dengan air dingin, ringan dan segar.",price:15000,image:"https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=700&q=85"},
  {id:2,category:"kopi",unit:"gelas",name:"Ice Cafe Latte",description:"Perpaduan espresso dan susu yang lembut.",price:18000,image:"https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=700&q=85"},
  {id:3,category:"kopi",unit:"gelas",name:"Caramel Macchiato",description:"Kopi susu dengan sentuhan manis karamel.",price:22000,image:"https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&w=700&q=85"},
  {id:4,category:"kopi",unit:"gelas",name:"Ice Mocha",description:"Espresso, susu, dan cokelat dalam satu gelas.",price:20000,image:"https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=700&q=85"},
  {id:5,category:"donat",unit:"pcs",name:"Classic Sugar Glaze",description:"Donat kentang empuk dengan lapisan gula klasik yang manis pas.",price:8000,image:"https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=700&q=85"},
  {id:6,category:"donat",unit:"pcs",name:"Choco Malt Crunch",description:"Donat lembut berlapis cokelat pekat dengan taburan malt renyah.",price:10000,image:"https://images.unsplash.com/photo-1514517521153-1be72277b32f?auto=format&fit=crop&w=700&q=85"},
  {id:7,category:"donat",unit:"pcs",name:"Strawberry Sprinkles",description:"Glaze stroberi segar dengan taburan meses warna-warni.",price:10000,image:"https://images.unsplash.com/photo-1631397833242-fc6213046352?auto=format&fit=crop&w=700&q=85"},
  {id:8,category:"donat",unit:"pcs",name:"Tiramisu Cream Donut",description:"Donat isi krim tiramisu lembut dengan taburan bubuk kakao.",price:12000,image:"https://images.unsplash.com/photo-1527515545081-5db817172677?auto=format&fit=crop&w=700&q=85"}
];

const whatsappNumber = "6281234567890"; // Ganti dengan nomor WhatsApp toko, gunakan format 62 tanpa tanda +
let cart = [];
let activeCategory = "all";

const productGrid = document.getElementById("productGrid");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const cartPanel = document.getElementById("cartPanel");
const overlay = document.getElementById("overlay");

function rupiah(number) {
  return new Intl.NumberFormat("id-ID", {style:"currency", currency:"IDR", maximumFractionDigits:0}).format(number);
}

function showProducts(category = "all") {
  const filtered = category === "all"
    ? products
    : products.filter(product => product.category === category);

  productGrid.innerHTML = filtered.map(product => `
    <article class="product-card">
      <div class="product-image">
        <span class="category-badge">${product.category === "kopi" ? "☕ Kopi" : "🍩 Donat"}</span>
        <img src="${product.image}" alt="${product.name}" loading="lazy">
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="product-bottom">
          <span class="price">${rupiah(product.price)}</span>
          <button class="add-button" onclick="addToCart(${product.id})" aria-label="Tambah ${product.name}">+</button>
        </div>
      </div>
    </article>
  `).join("");
}

function addToCart(id) {
  const found = cart.find(item => item.id === id);
  if (found) found.quantity++;
  else cart.push({...products.find(product => product.id === id), quantity:1});
  updateCart();
  openCart();
}

function changeQuantity(id, amount) {
  const item = cart.find(product => product.id === id);
  if (!item) return;
  item.quantity += amount;
  if (item.quantity <= 0) cart = cart.filter(product => product.id !== id);
  updateCart();
}

function updateCart() {
  const count = cart.reduce((sum,item) => sum + item.quantity, 0);
  const total = cart.reduce((sum,item) => sum + item.price * item.quantity, 0);
  cartCount.textContent = count;
  cartTotal.textContent = rupiah(total);
  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="empty-cart">Keranjangmu masih kosong. Pilih kopi atau donat favoritmu dulu, ya.</p>';
    return;
  }
  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div><strong>${item.name}</strong><small>${rupiah(item.price)} / ${item.unit || "item"}</small></div>
      <div class="quantity">
        <button onclick="changeQuantity(${item.id},-1)" aria-label="Kurangi">−</button>
        <span>${item.quantity}</span>
        <button onclick="changeQuantity(${item.id},1)" aria-label="Tambah">+</button>
      </div>
    </div>
  `).join("");
}

function openCart() {
  cartPanel.classList.add("open");
  overlay.classList.add("show");
  cartPanel.setAttribute("aria-hidden","false");
}
function closeCart() {
  cartPanel.classList.remove("open");
  overlay.classList.remove("show");
  cartPanel.setAttribute("aria-hidden","true");
}

document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeCategory = btn.dataset.category;
    showProducts(activeCategory);
  });
});

document.getElementById("openCart").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);
document.getElementById("menuToggle").addEventListener("click", () => {
  document.getElementById("mainNav").classList.toggle("show");
});
document.querySelectorAll(".main-nav a").forEach(link => link.addEventListener("click", () => {
  document.getElementById("mainNav").classList.remove("show");
}));

document.getElementById("checkoutButton").addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Keranjang masih kosong. Pilih menu kopi atau donat terlebih dahulu.");
    return;
  }
  const lines = cart.map(item => `- ${item.name} x${item.quantity} = ${rupiah(item.price * item.quantity)}`);
  const total = cart.reduce((sum,item) => sum + item.price * item.quantity, 0);
  const message = `Halo fifteen0Five, saya ingin memesan:\n${lines.join("\n")}\n\nTotal: ${rupiah(total)}\n\nNama:\nAlamat/pengambilan:`;
  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank");
});

showProducts();
updateCart();
