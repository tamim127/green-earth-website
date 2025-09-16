
//  DOM Elements

const categoriesContainer = document.getElementById("categories-container");
const cardContainer = document.getElementById("card-container");
const allTreesBtn = document.querySelector(".bg-green-700");
const cartContainer = document.getElementById("cart-container");
const totalPriceEl = document.querySelector(".totalPrice");
const spinner = document.getElementById("spinner");
const modal = document.getElementById("treeModal");
const modalContent = document.getElementById("modalContent");


//  Cart State (memory)

let cart = [];

//  Spinner Functions
function showSpinner() {
    spinner.classList.remove("hidden");
}
function hideSpinner() {
    spinner.classList.add("hidden");
}

//  Load Categories

async function loadCategories() {
    showSpinner();
    try {
        const res = await fetch("https://openapi.programming-hero.com/api/categories");
        const data = await res.json();
        displayCategories(data.categories);
    } catch (err) {
        console.error("Error loading categories:", err);
    } finally {
        hideSpinner();
    }
}

function displayCategories(categories) {
    categoriesContainer.innerHTML = "";

    categories.forEach(category => {
        const div = document.createElement("div");
        div.className = "cursor-pointer p-2 rounded-lg transition hover:bg-green-600 hover:text-white";
        div.innerText = category.category_name;

        // Category Click
        div.addEventListener("click", () => {
            loadCategoryPlants(category.id);
            highlightActiveCategory(div);
        });
        categoriesContainer.appendChild(div);
    });
}
function highlightActiveCategory(activeDiv) {
    categoriesContainer.querySelectorAll("div").forEach(div => {
        div.classList.remove("bg-green-600", "text-white");
    });
    activeDiv.classList.add("bg-green-600", "text-white");
}


//  Load Plants

async function loadAllPlants() {
    showSpinner();
    try {
        const res = await fetch("https://openapi.programming-hero.com/api/plants");
        const data = await res.json();
        displayPlants(data.plants);
    } catch (err) {
        console.error("Error loading plants:", err);
    } finally {
        hideSpinner();
    }
}

async function loadCategoryPlants(id) {
    showSpinner();
    try {
        const res = await fetch(`https://openapi.programming-hero.com/api/category/${id}`);
        const data = await res.json();
        const plants = data.plants || data.data || [];
        displayPlants(plants);
    } catch (err) {
        console.error("Error loading category plants:", err);
    } finally {
        hideSpinner();
    }
}

//  Display Plants

function displayPlants(plants) {
    cardContainer.innerHTML = "";
    if (!plants || plants.length === 0) {
        cardContainer.innerHTML = `<p class="col-span-3 text-center py-6">No plants found.</p>`;
        return;
    }
    plants.forEach(plant => {
        const cardDiv = document.createElement("div");
        cardDiv.innerHTML = `
      <div class="card bg-base-100 cursor-pointer">
        <figure class="px-3 pt-3">
          <img src="${plant.image}" alt="${plant.name}" class="rounded-xl w-[312px] h-[187px]" />
        </figure>
        <div class="p-3 space-y-2">
          <h1 class="plant-name font-semibold text-[14px]">${plant.name}</h1>
          <p class="text-[12px]">${plant.description}</p>
          <div class="flex justify-between">
            <p class="bg-[#DCFCE7] text-[#15803D] rounded-3xl text-[14px] px-3 py-2">${plant.category}</p>
            <p class="font-semibold text-[14px]">৳${plant.price}</p>
          </div>
          <button class="btn bg-[#15803d] text-white text-[16px] rounded-3xl w-full mt-4 hover:scale-103">
            Add to Cart
          </button>
        </div>
      </div>
    `;

        // Open modal when clicking plant name

        cardDiv.querySelector(".plant-name")
            .addEventListener("click", () => openModalById(plant.id));

        // Add to cart button
        cardDiv.querySelector("button")
            .addEventListener("click", (e) => {
                e.stopPropagation();
                addToCart(plant);
                alert(`${plant.name} has been added to the cart`);
            });
        cardContainer.appendChild(cardDiv);
    });
}

//  Cart Functions

function addToCart(plant) {
    if (!plant?.id) return;
    const existing = cart.find(item => item.id === plant.id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...plant, quantity: 1 });
    }
    renderCart();
}

function renderCart() {
    cartContainer.innerHTML = "";
    let total = 0;
    cart.forEach(item => {
        const lineTotal = item.price * item.quantity;
        total += lineTotal;
        const cartItem = document.createElement("div");
        cartItem.className = "flex justify-between items-center bg-[#F0FDF4] mx-3 p-3 rounded-lg";
        cartItem.innerHTML = `
      <div>
        <h1 class="font-semibold text-[14px] mb-1">${item.name}</h1>
        <p class="text-[12px]">৳${item.price} x ${item.quantity}</p>
      </div>
      <button class="remove-item-btn text-gray-600 hover:text-red-500">
        <i class="fa-solid fa-xmark"></i>
      </button>
    `;

        // Remove item button
        cartItem.querySelector(".remove-item-btn")
            .addEventListener("click", () => {
                cart = cart.filter(i => i.id !== item.id);
                renderCart();
            });
        cartContainer.appendChild(cartItem);
    });
    totalPriceEl.textContent = `${total} TK`;
}


//  Modal Functions

modal.addEventListener("click", (e) => {
    if (e.target.id === "closeModalBtn" || e.target === modal) {
        modal.classList.add("hidden");
    }
});
async function openModalById(id) {
    showSpinner();
    try {
        const res = await fetch(`https://openapi.programming-hero.com/api/plant/${id}`);
        const data = await res.json();
        const tree = data?.plants;
        if (!tree) return;
        modalContent.innerHTML = `
      <img src="${tree.image}" class="w-full h-[300px] rounded mb-4" />
      <h2 class="text-xl font-bold mb-2">${tree.name}</h2>
      <p class="text-gray-700 mb-2">${tree.description}</p>
      <p class="text-sm text-gray-500 mb-2"><strong>Category:</strong> ${tree.category}</p>
      <p class="text-lg font-bold text-[#15803D]">৳${tree.price}</p>
      <button id="closeModalBtn" class="bg-[#15803D] text-white px-4 py-2 rounded-lg mt-4">Close</button>
    `;
        modal.classList.remove("hidden");
    } catch (err) {
        console.error("Error loading tree details:", err);
    } finally {
        hideSpinner();
    }
}


//  Event Listeners

allTreesBtn.addEventListener("click", () => {
    loadAllPlants();
    categoriesContainer.querySelectorAll("div").forEach(div =>
        div.classList.remove("bg-green-600", "text-white")
    );
});

loadCategories();
loadAllPlants();