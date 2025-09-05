import { products } from '../data/products.js';
document.addEventListener("DOMContentLoaded", function () {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const checkoutCountElement = document.querySelector(".header__checkout-count");
    const cartPreviewElement = document.querySelector(".header__cart-preview");
    const cartItemsElement = document.querySelector(".header__cart-items");
    const cartTotalElement = document.querySelector(".header__cart-total-amount");
    const productListElement = document.querySelector('.store__product-list');
    const toastContainer = document.querySelector('.toast-container');

    // FUNCTION TO RENDER PRODUCTS
    function renderProducts(products) {
        productListElement.innerHTML = ''; // CLEAR EXISTING CONTENT

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

    // FUNCTION TO ATTACH EVENT LISTENERS TO "Add to Basket" BUTTONS
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

    // FUNCTION TO UPDATE THE CART IN localStorage AND UPDATE THE CHECKOUT COUNT
    function updateCart() {
        localStorage.setItem('cart', JSON.stringify(cart)); // Save the cart to localStorage
        checkoutCountElement.textContent = cart.reduce((acc, item) => acc + item.quantity, 0); // Update cart count
        updateCartPreview(); // Update the mini-cart preview
    }

    // FUNCTION TO UPDATE THE MINI-BASKET PREVIEW
    function updateCartPreview() {
        cartItemsElement.innerHTML = ''; // CLEAR EXISTING ITEMS
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

            // INCREASE QUANTITY
            li.querySelector('.header__cart-item-increase').addEventListener('click', () => {
                item.quantity++;
                updateCart();
            });

            // DECREASE QUANTITY
            li.querySelector('.header__cart-item-decrease').addEventListener('click', () => {
                if (item.quantity > 1) {
                    item.quantity--;
                } else {
                    cart.splice(index, 1); // REMOVE ITEM IF QUANTITY IS 0
                }
                showToast(`${item.name} removed from basket`, 'error'); // MAKE SURE 'item.name' is used here
                updateCart();
            });

            // REMOVE ITEM
            li.querySelector('.header__cart-item-remove').addEventListener('click', () => {
                cart.splice(index, 1);
                showToast(`${item.name} removed from basket`, 'error'); // MAKE SURE 'item.name' IS USED HERE
                updateCart();
            });

            cartItemsElement.appendChild(li);
            total += item.price * item.quantity;
        });

        cartTotalElement.textContent = total.toFixed(2);
    }

    // FUNCTION TO CLEAR THE BASKET
    function clearCart() {
        cart = [];
        updateCart();
        showToast(`Cleared entire basket`, 'error'); // Make sure 'item.name' is used here
    }

    // FUNCTION TO SHOW TOAST NOTIFICATIONS
    function showToast(message, type) {
        const toast = document.createElement('div');
        toast.className = `toast toast--${type} toast--visible`;
        toast.textContent = message;

        toastContainer.appendChild(toast);

        // REMOVE THE TOAST AFTER A FEW SECONDS
        setTimeout(() => {
            toast.classList.remove('toast--visible');
            toast.addEventListener('transitionend', () => toast.remove());
        }, 3000);
    }

    // SHOW CART PREVIEW ON HOVER
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

    // INITIAL RENDER AND UPDATE
    renderProducts(products);
    updateCart();

    // HANDLE CLICKING ON THE "Clear Cart" BUTTON
    document.querySelector('.header__clear-cart-button').addEventListener('click', clearCart);

    // HANDLE CLICKING ON THE "View Cart" BUTTON
    document.querySelector('.header__view-cart-button').addEventListener('click', function () {
        // HERE YOU CAN IMPLEMENT A MODAL TO SHOW THE DETAILED VIEW OF THE CART
        console.log('View Cart clicked:', cart);
    });
});