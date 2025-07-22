let allProducts = [];
let cart = [];

const container = document.getElementById("product-list");
const categories = document.querySelectorAll(".category-card");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsList = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartEmptyMsg = document.getElementById("cart-empty-msg");
const closeCartBtn = document.getElementById("close-cart");

function loadCart() {
  const saved = localStorage.getItem("pawffect_cart");
  if (saved) {
    cart = JSON.parse(saved);
  }
}

function saveCart() {
  localStorage.setItem("pawffect_cart", JSON.stringify(cart));
}

function updateCartCount() {
  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalQty;
}

function renderCart() {
  cartItemsList.innerHTML = "";

  if (cart.length === 0) {
    cartEmptyMsg.style.display = "block";
    return;
  } else {
    cartEmptyMsg.style.display = "none";
  }

  cart.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${item.name} (x${item.quantity})</span>
      <button class="remove-item-btn" data-id="${item.id}">Remove</button>
    `;
    cartItemsList.appendChild(li);
  });

  document.querySelectorAll(".remove-item-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.getAttribute("data-id"));
      removeFromCart(id);
    });
  });
}

function addToCart(product) {
  const found = cart.find((item) => item.id === product.id);
  if (found) {
    found.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCart();
  updateCartCount();
  alert(`Added "${product.name}" to cart!`);
}

function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id);
  saveCart();
  updateCartCount();
  renderCart();
}

function displayProducts(filterCategory = "all") {
  container.innerHTML = "";
  const filtered =
    filterCategory === "all"
      ? allProducts
      : allProducts.filter((p) => p.category === filterCategory);

  filtered.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";
    if (product.stock === 0) card.classList.add("stock-out");

    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>৳${product.price}</p>
      ${
        product.stock > 0
          ? `<button>Add to Cart</button>`
          : `<button disabled>Out of Stock</button>`
      }
    `;

    container.appendChild(card);

    if (product.stock > 0) {
      const btn = card.querySelector("button");
      btn.addEventListener("click", () => {
        addToCart(product);
      });
    }
  });
}

fetch("products.json")
  .then((res) => res.json())
  .then((products) => {
    allProducts = products;
    loadCart();
    updateCartCount();
    displayProducts();

    categories.forEach((catBtn) => {
      catBtn.addEventListener("click", () => {
        categories.forEach((c) => c.classList.remove("active"));
        catBtn.classList.add("active");

        const category = catBtn.getAttribute("data-category");
        displayProducts(category);
      });
    });

    document
      .querySelector('.category-card[data-category="all"]')
      .classList.add("active");
  })
  .catch((err) => console.error("Error loading products:", err));

cartBtn.addEventListener("click", () => {
  renderCart();
  cartModal.classList.remove("hidden");
});

closeCartBtn.addEventListener("click", () => {
  cartModal.classList.add("hidden");
});

cartModal.addEventListener("click", (e) => {
  if (e.target === cartModal) {
    cartModal.classList.add("hidden");
  }
});

document
  .getElementById("contact-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    alert(
      "Thanks for contacting PAWFFECT NEEST! We will get back to you soon."
    );
    this.reset();
  });
