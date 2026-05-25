let cart = JSON.parse(localStorage.getItem('QuickBites_Cart')) || [];

// ---------------- CART BADGE ----------------
function updateCartBadge() {
    const badges = document.querySelectorAll('.position-absolute.badge');

    const totalItems = cart.reduce((sum, item) => {
        return sum + item.quantity;
    }, 0);

    badges.forEach((badge) => {
        badge.textContent = totalItems;

        if (totalItems === 0) {
            badge.style.display = "none";
        } else {
            badge.style.display = "inline-block";
        }
    });
}

// ---------------- AUTH SYSTEM ----------------
function checkAuthStatus() {

    const authWrapper = document.getElementById("auth-wrapper");

    if (!authWrapper) return;

    const user = localStorage.getItem("QuickBites_User");

    if (user) {

        authWrapper.innerHTML = `
            <div class="dropdown">
                <button class="btn btn-orange btn-sm dropdown-toggle px-3"
                    type="button"
                    data-bs-toggle="dropdown">

                    <i class="bi bi-person-circle me-1"></i>
                    Hi, ${user}
                </button>

                <ul class="dropdown-menu dropdown-menu-end shadow">
                    <li>
                        <a class="dropdown-item text-danger fw-bold"
                           href="#"
                           onclick="handleSignOut(event)">
                           Sign Out
                        </a>
                    </li>
                </ul>
            </div>
        `;

    } else {

        authWrapper.innerHTML = `
            <button class="btn btn-outline-light btn-sm px-3"
                onclick="handleSignIn()">
                Sign In
            </button>
        `;
    }
}

function handleSignIn() {

    const name = prompt("Please enter your name to Sign In:");

    if (name && name.trim() !== "") {

        localStorage.setItem(
            "QuickBites_User",
            name.trim()
        );

        checkAuthStatus();

        alert(`Welcome ${name}! Happy Food Ordering 🍔`);
    }
}

window.handleSignOut = function (e) {

    e.preventDefault();

    localStorage.removeItem("QuickBites_User");

    checkAuthStatus();

    alert("Signed out successfully!");
};

// ---------------- ADD TO CART ----------------
function addToCart(product) {

    const existingProduct = cart.find((item) => {
        return item.id === product.id;
    });

    if (existingProduct) {

        existingProduct.quantity += 1;

    } else {

        cart.push({
            ...product,
            quantity: 1
        });
    }

    localStorage.setItem(
        "QuickBites_Cart",
        JSON.stringify(cart)
    );

    updateCartBadge();

    alert(`😋 ${product.name} added to cart!`);

    if (window.location.pathname.endsWith("cart.html")) {
        renderCartPage();
    }
}

// ---------------- CHANGE QUANTITY ----------------
window.changeQuantity = function (id, amount) {

    const product = cart.find((item) => {
        return item.id === id;
    });

    if (product) {

        product.quantity += amount;

        if (product.quantity <= 0) {

            removeFromCart(id);
            return;
        }

        localStorage.setItem(
            "QuickBites_Cart",
            JSON.stringify(cart)
        );

        renderCartPage();

        updateCartBadge();
    }
};

// ---------------- REMOVE ITEM ----------------
window.removeFromCart = function (id) {

    cart = cart.filter((item) => {
        return item.id !== id;
    });

    localStorage.setItem(
        "QuickBites_Cart",
        JSON.stringify(cart)
    );

    renderCartPage();

    updateCartBadge();
};

// ---------------- RENDER CART PAGE ----------------
function renderCartPage() {

    const itemsWrapper = document.getElementById("cart-items-wrapper");

    const summaryWrapper = document.getElementById("cart-summary-wrapper");

    if (!itemsWrapper || !summaryWrapper) return;

    // EMPTY CART
    if (cart.length === 0) {

        itemsWrapper.innerHTML = `
            <div class="card border-0 shadow-sm p-5 text-center w-100">

                <i class="bi bi-basket text-muted display-1 mb-3"></i>

                <h4 class="fw-bold">
                    Your Basket is Empty!
                </h4>

                <a href="menu.html"
                   class="btn btn-orange mx-auto mt-3 px-4">

                    Browse Menu
                </a>

            </div>
        `;

        summaryWrapper.innerHTML = "";

        return;
    }

    let itemsHTML = `
        <h2 class="fw-bold mb-4">
            Your Selected Food
        </h2>
    `;

    let subtotal = 0;

    cart.forEach((item) => {

        const itemTotal = item.price * item.quantity;

        subtotal += itemTotal;

        itemsHTML += `
            <div class="card border-0 shadow-sm p-3 mb-3">

                <div class="row align-items-center g-3">

                    <div class="col-md-2 col-4">
                        <img src="${item.img}"
                             class="img-fluid rounded"
                             style="height:65px; object-fit:cover; width:100%;">
                    </div>

                    <div class="col-md-5 col-8">

                        <h6 class="fw-bold mb-0">
                            ${item.name}
                        </h6>

                        <small class="text-muted">
                            ${item.category}
                        </small>

                    </div>

                    <div class="col-md-3 col-6 d-flex align-items-center">

                        <button class="btn btn-sm btn-outline-secondary py-0 px-2"
                            onclick="changeQuantity('${item.id}', -1)">
                            -
                        </button>

                        <span class="mx-3 fw-bold">
                            ${item.quantity}
                        </span>

                        <button class="btn btn-sm btn-outline-secondary py-0 px-2"
                            onclick="changeQuantity('${item.id}', 1)">
                            +
                        </button>

                    </div>

                    <div class="col-md-2 col-6 text-end">

                        <span class="fw-bold text-orange d-block">
                            ₹${itemTotal}
                        </span>

                        <button class="btn btn-link text-muted btn-sm p-0"
                            onclick="removeFromCart('${item.id}')">

                            Remove
                        </button>

                    </div>

                </div>

            </div>
        `;
    });

    itemsWrapper.innerHTML = itemsHTML;

    summaryWrapper.innerHTML = `
        <div class="card border-0 shadow-sm p-4 position-sticky"
             style="top:90px;">

            <h4 class="fw-bold mb-3">
                Order Bill
            </h4>

            <div class="d-flex justify-content-between mb-2">
                <span>Subtotal</span>
                <span class="fw-bold">₹${subtotal}</span>
            </div>

            <div class="d-flex justify-content-between mb-2">
                <span>Delivery Fee</span>
                <span class="text-success fw-bold">FREE</span>
            </div>

            <hr>

            <div class="d-flex justify-content-between mb-4">

                <h5>Total</h5>

                <h4 class="text-orange fw-bold">
                    ₹${subtotal}
                </h4>

            </div>

            <a href="checkout.html"
               class="btn btn-orange w-100 py-3 fw-bold text-white">

                Proceed to Checkout
            </a>

        </div>
    `;
}

// ---------------- DOM LOADED ----------------
document.addEventListener("DOMContentLoaded", () => {

    // THEME BUTTON
    const themeBtn = document.getElementById("themeBtn");

    if (localStorage.getItem("theme") === "dark") {

        document.body.classList.add("dark-mode");

        if (themeBtn) {

            themeBtn.innerHTML =
                '<i class="bi bi-sun-fill me-1"></i> Light';
        }
    }

    if (themeBtn) {

        themeBtn.addEventListener("click", () => {

            document.body.classList.toggle("dark-mode");

            if (document.body.classList.contains("dark-mode")) {

                themeBtn.innerHTML =
                    '<i class="bi bi-sun-fill me-1"></i> Light';

                localStorage.setItem("theme", "dark");

            } else {

                themeBtn.innerHTML =
                    '<i class="bi bi-moon-fill me-1"></i> Mode';

                localStorage.setItem("theme", "light");
            }
        });
    }

    // INITIAL FUNCTIONS
    updateCartBadge();

    checkAuthStatus();

    // ADD TO CART BUTTONS
    document.querySelectorAll(".fd-product-card").forEach((card) => {

        const btn = card.querySelector(
            ".btn-orange-outline, .btn-orange"
        );

        if (btn) {

            btn.addEventListener("click", (e) => {

                e.preventDefault();

                const name =
                    card.querySelector("h5").textContent.trim();

                const price = parseInt(
                    card.querySelector(".text-orange")
                        .textContent
                        .replace(/[^\d]/g, "")
                );

                const img =
                    card.querySelector("img").src;

                const category =
                    card.querySelector(".badge")
                        .textContent
                        .trim();

                const id =
                    "food_" +
                    name.replace(/\s+/g, "_").toLowerCase();

                addToCart({
                    id,
                    name,
                    price,
                    img,
                    category
                });
            });
        }
    });

    // CART PAGE
    if (window.location.pathname.endsWith("cart.html")) {

        renderCartPage();
    }
});
// ---------------- SEARCH + CATEGORY FILTER ----------------

const searchInput =
    document.getElementById("searchInput");

const categoryFilter =
    document.getElementById("categoryFilter");

function filterProducts() {

    const searchValue =
        searchInput
            ? searchInput.value.toLowerCase()
            : "";

    const selectedCategory =
        categoryFilter
            ? categoryFilter.value.toLowerCase()
            : "all";

    document.querySelectorAll(".fd-product-card")
        .forEach((card) => {

            const foodName =
                card.querySelector("h5")
                    .textContent
                    .toLowerCase();

            const category =
                card.querySelector(".badge")
                    .textContent
                    .trim()
                    .toLowerCase();

            const parentCol =
                card.closest(".col-lg-4");

            const matchesSearch =
                foodName.includes(searchValue);

            const matchesCategory =
                selectedCategory === "all" ||
                category === selectedCategory;

            if (
                matchesSearch &&
                matchesCategory
            ) {

                parentCol.style.display = "block";

            } else {

                parentCol.style.display = "none";
            }
        });
}

// SEARCH EVENT
if (searchInput) {

    searchInput.addEventListener(
        "keyup",
        filterProducts
    );
}

// CATEGORY EVENT
if (categoryFilter) {

    categoryFilter.addEventListener(
        "change",
        filterProducts
    );
}