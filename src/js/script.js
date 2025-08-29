import { products } from "../data/products";
document.addEventListener("DOMContentLoaded", function () {
    const checkoutCountElement = document.querySelector(".header__checkout-count");
    const cartPreviewElement = document.querySelector(".header__cart-preview");
    const cartItemsElement = document.querySelector(".header__cart-items");
    const cartTotalElement = document.querySelector(".header__cart-total-amount");
    const productListElement = document.querySelector(".store__product-list");
    const toastContainer = document.querySelector(".toast-container");

    // Function to render products
    function renderProducts(products) {
        productListElement.innerHTML = ''; //Clear existing content

        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('store__product');
            productElement.setAttribute('data-id', product.id);

            productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="store__product-image">
            <h2 class="store__product-name">${product.name}</h2>
            <p class="store__product-price">$${product.price.toFixed(2)}</p>
            <p class="store__product-description">${product.description}</p>
            <button class="store__add-to-cart">Add to Basket</button>
            `;

            productListElement.appendChild(productElement);
        });

        attachAddToCartListeners();
    }

      // Initial render and update
      renderProducts(products);
});