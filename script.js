const productsContainer = document.querySelector(".product-grid");
const cart = JSON.parse(localStorage.getItem("cart")) || [];

function fetchProducts(limit = null) {
    fetch('https://dummyjson.com/products')
        .then(res => res.json())
        .then(data => {
            const products = limit ? data.products.slice(0, limit) : data.products;
            displayProducts(products);
        })
        .catch(error => console.error("Error fetching products:", error));
}

function displayProducts(products) {
    if (productsContainer) {
        productsContainer.innerHTML = products
            .map(
                product => `
            <div class="product">
                <img src="${product.thumbnail}" alt="${product.title}">
                <h3>${product.title}</h3>
                <p>${product.description}</p>
                <p>Price: $${product.price}</p>
                <button onclick="addToCart(${product.id}, '${product.title}', ${product.price})">Add to Cart</button>
            </div>
        `
            )
            .join("");
    }
}

function addToCart(id, title, price) {
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        alert("This product is already in your cart.");
    } else {
        cart.push({ id, title, price, quantity: 1, totalPrice: price });
        localStorage.setItem("cart", JSON.stringify(cart));
        alert(`${title} has been added to your cart.`);
    }
}

function loadCartItems() {
    const cartItemsContainer = document.getElementById("cart-items");
    const totalPriceElement = document.getElementById("total-price");
    if (cartItemsContainer) {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
            totalPriceElement.textContent = "Total: $0.00";
        } else {
            let total = 0;
            cartItemsContainer.innerHTML = cart
                .map(
                    (item, index) => {
                        total += item.totalPrice;
                        return `
                    <div class="cart-item">
                        <p>${item.title}</p>
                        <p>Price: $${item.price}</p>
                        <p>
                            Quantity: 
                            <button onclick="decreaseQuantity(${index})">-</button>
                            ${item.quantity}
                            <button onclick="increaseQuantity(${index})">+</button>
                        </p>
                        <p>Total: $${item.totalPrice.toFixed(2)}</p>
                        <button onclick="deleteItem(${index})">Delete</button>
                    </div>
                `;
                    }
                )
                .join("");
            totalPriceElement.textContent = `Total: $${total.toFixed(2)}`;
        }
    }
}

function increaseQuantity(index) {
    cart[index].quantity += 1;
    cart[index].totalPrice = cart[index].price * cart[index].quantity;
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCartItems();
}

function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
        cart[index].totalPrice = cart[index].price * cart[index].quantity;
    } else {
        deleteItem(index);
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCartItems();
}

function deleteItem(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCartItems();
}

function buyNow() {
    if (cart.length > 0) {
        alert("Purchase successful! Thank you for shopping.");
        cart.length = 0;
        localStorage.removeItem("cart");
        loadCartItems();
    } else {
        alert("Your cart is empty!");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    if (productsContainer) {
        const isLandingPage = document.title.includes("Imtiaz Online Store") && !document.title.includes("Products");
        fetchProducts(isLandingPage ? 8 : null); 
    }
    loadCartItems(); 
});
