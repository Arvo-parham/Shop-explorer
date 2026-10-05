const API_URL = "https://dummyjson.com/products";

const productsLayout = document.querySelector(".products-layout");
const categoryFilter = document.querySelector("#categoryFilter");
const sortSelect = document.querySelector("#sortSelect");
const cartContainer = document.querySelector(".cart-products");

let products = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// =========================
// Products
// =========================

async function getProducts() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await response.json();

    products = data.products;

    renderProducts(products);
  } catch (error) {
    console.error(error);
  }
}

function renderProducts(products) {
  productsLayout.innerHTML = "";

  products.forEach((product) => {
    const productHTML = `
      <div class="product-box">
        <img 
          src="${product.thumbnail}" 
          alt="${product.title}"
        />

        <h3>${product.title}</h3>

        <p class="product-description">
          ${product.description}
        </p>

        <div class="product-details">
          <p>
            <i class="fa fa-dollar" aria-hidden="true"></i>
            ${product.price}
          </p>

          <p>
            <i class="fa fa-star" aria-hidden="true"></i>
            ${product.rating}
          </p>

          <button 
            class="addToCart" 
            data-id="${product.id}"
          >
            <i class="fa fa-store" aria-hidden="true"></i>
            Add
          </button>
        </div>
      </div>
    `;

    productsLayout.innerHTML += productHTML;
  });
}

// =========================
// Filter
// =========================

function filterProducts(products, category) {
  if (category === "all") {
    return products;
  }

  return products.filter((product) => {
    return product.category === category;
  });
}

// =========================
// Sort
// =========================

function sortProducts(products, sortType) {
  const sortedProducts = [...products];

  switch (sortType) {
    case "price-low-high":
      sortedProducts.sort((a, b) => {
        return a.price - b.price;
      });
      break;

    case "price-high-low":
      sortedProducts.sort((a, b) => {
        return b.price - a.price;
      });
      break;

    case "rating-high-low":
      sortedProducts.sort((a, b) => {
        return b.rating - a.rating;
      });
      break;

    case "name-a-z":
      sortedProducts.sort((a, b) => {
        return a.title.localeCompare(b.title);
      });
      break;

    default:
      break;
  }

  return sortedProducts;
}

// =========================
// Update Products
// =========================

function updateProducts() {
  const selectedCategory = categoryFilter.value;
  const selectedSort = sortSelect.value;

  const filteredProducts = filterProducts(
    products,
    selectedCategory
  );

  const sortedProducts = sortProducts(
    filteredProducts,
    selectedSort
  );

  renderProducts(sortedProducts);
}

// =========================
// Add To Cart
// =========================

function addToCart(productId) {
  const product = products.find(
    (product) => product.id === productId
  );

  const existingProduct = cart.find(
    (product) => product.id === productId
  );

  if (!existingProduct) {
    cart.push(product);

    localStorage.setItem(
      "cart",
      JSON.stringify(cart)
    );
  }
}

// =========================
// Render Cart
// =========================

function renderCart() {
  cartContainer.innerHTML = "";

  cart.forEach((product) => {
    cartContainer.innerHTML += `
      <div class="cart-product">
        <img 
          src="${product.thumbnail}" 
          alt="${product.title}"
        />

        <h3>${product.title}</h3>

        <p>$${product.price}</p>

        <button 
          class="removeFromCart" 
          data-id="${product.id}"
        >
          <i class="fa-solid fa-trash"></i>
          Remove
        </button>
      </div>
    `;
  });
}

// =========================
// Remove From Cart
// =========================

function removeFromCart(productId) {
  cart = cart.filter(
    (product) => product.id !== productId
  );

  localStorage.setItem(
    "cart",
    JSON.stringify(cart)
  );

  renderCart();
}

// =========================
// Index Page Events
// =========================

if (productsLayout) {
  categoryFilter.addEventListener("change", () => {
    updateProducts();
  });

  sortSelect.addEventListener("change", () => {
    updateProducts();
  });

  productsLayout.addEventListener("click", (event) => {
    const addButton = event.target.closest(".addToCart");

    if (!addButton) {
      return;
    }

    const productId = Number(addButton.dataset.id);

    addToCart(productId);
  });

  getProducts();
}

// =========================
// Cart Page Events
// =========================

if (cartContainer) {
  cartContainer.addEventListener("click", (event) => {
    const removeButton =
      event.target.closest(".removeFromCart");

    if (!removeButton) {
      return;
    }

    const productId = Number(removeButton.dataset.id);

    removeFromCart(productId);
  });

  renderCart();
}