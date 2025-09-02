import { products } from '../data/products.js';
document.addEventListener("DOMContentLoaded", function () {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const checkoutCountElement = document.querySelector(".header__checkout-count");
    const cartPreviewElement = document.querySelector(".header__cart-preview");
    const cartItemsElement = document.querySelector(".header__cart-items");
    const cartTotalElement = document.querySelector(".header__cart-total-amount");
    const productListElement = document.querySelector('.store__product-list');
    const toastContainer = document.querySelector('.toast-container');

    // Function to render products
    function renderProducts(products) {
        productListElement.innerHTML = ''; // Clear existing content

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

    // Function to attach event listeners to "Add to Basket" buttons
    function attachAddToCartListeners() {
        document.querySelectorAll(".store__add-to-cart").forEach(button => {
            button.addEventListener("click", function () {
                const productElement = this.parentElement;
                const productId = productElement.getAttribute("data-id");
                const productName = productElement.querySelector(".store__product-name").textContent;
                const productPrice = parseFloat(productElement.querySelector(".store__product-price").textContent.replace('$', ''));
                const productImage = productElement.querySelector(".store__product-image").src;

                const existingProduct = cart.find(item => item.id === productId);

                if (existingProduct) {
                    existingProduct.quantity++;
                } else {
                    const product = {
                        id: productId,
                        name: productName,
                        price: productPrice,
                        image: productImage,
                        quantity: 1
                    };
                    cart.push(product);
                }

                updateCart();
                showToast(`${productName} added to basket`, 'success');
            });
        });
    }

    // Function to update the cart in localStorage and update the checkout count
    function updateCart() {
        localStorage.setItem('cart', JSON.stringify(cart)); // Save the cart to localStorage
        checkoutCountElement.textContent = cart.reduce((acc, item) => acc + item.quantity, 0); // Update cart count
        updateCartPreview(); // Update the mini-cart preview
    }

    // Function to update the mini-basket preview
    function updateCartPreview() {
        cartItemsElement.innerHTML = ''; // Clear existing items
        let total = 0;

        cart.forEach((item, index) => {
            const li = document.createElement('li');
            li.classList.add('header__cart-item');
            li.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="header__cart-item-image">
                <span class="header__cart-item-name">${item.name}</span>
                <span class="header__cart-item-quantity">x${item.quantity}</span>
                <span class="header__cart-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
                <button class="header__cart-item-increase">+</button>
                <button class="header__cart-item-decrease">-</button>
                <button class="header__cart-item-remove">X</button>
            `;

            // Increase quantity
            li.querySelector('.header__cart-item-increase').addEventListener('click', () => {
                item.quantity++;
                updateCart();
            });

            // Decrease quantity
            li.querySelector('.header__cart-item-decrease').addEventListener('click', () => {
                if (item.quantity > 1) {
                    item.quantity--;
                } else {
                    cart.splice(index, 1); // Remove item if quantity is 0
                }
                showToast(`${item.name} removed from basket`, 'error'); // Make sure 'item.name' is used here
                updateCart();
            });

            // Remove item
            li.querySelector('.header__cart-item-remove').addEventListener('click', () => {
                cart.splice(index, 1);
                showToast(`${item.name} removed from basket`, 'error'); // Make sure 'item.name' is used here
                updateCart();
            });

            cartItemsElement.appendChild(li);
            total += item.price * item.quantity;
        });

        cartTotalElement.textContent = total.toFixed(2);
    }

    // Function to clear the basket
    function clearCart() {
        cart = [];
        updateCart();
        showToast(`Cleared entire basket`, 'error'); // Make sure 'item.name' is used here
    }

    // Function to show toast notifications
    function showToast(message, type) {
        const toast = document.createElement('div');
        toast.className = `toast toast--${type} toast--visible`;
        toast.textContent = message;

        toastContainer.appendChild(toast);

        // Remove the toast after a few seconds
        setTimeout(() => {
            toast.classList.remove('toast--visible');
            toast.addEventListener('transitionend', () => toast.remove());
        }, 3000);
    }

    // Show cart preview on hover
    const checkoutLink = document.querySelector('.header__checkout-link');

    cartPreviewElement.addEventListener('mouseenter', () => {
        cartPreviewElement.style.display = 'flex';
    });

    checkoutLink.addEventListener('mouseenter', () => {
        cartPreviewElement.style.display = 'flex';
    });

    cartPreviewElement.addEventListener('mouseleave', () => {
        cartPreviewElement.style.display = 'none';
    });

    checkoutLink.addEventListener('mouseleave', () => {
        cartPreviewElement.style.display = 'none';
    });

    // Initial render and update
    renderProducts(products);
    updateCart();

    // Handle clicking on the "Clear Cart" button
    document.querySelector('.header__clear-cart-button').addEventListener('click', clearCart);

    // Handle clicking on the "View Cart" button
    document.querySelector('.header__view-cart-button').addEventListener('click', function () {
        // Here you can implement a modal to show the detailed view of the cart
        console.log('View Cart clicked:', cart);
    });
});