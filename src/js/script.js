import { products } from "../data/products";
document.addEventListener("DOMContentLoaded", function () {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const checkoutCountElement = document.querySelector(".header__checkout-count");
    const cartPreviewElement = document.querySelector(".header__cart-preview");
    const cartItemsElement = document.querySelector(".header__cart-items");
    const cartTotalElement = document.querySelector(".header__cart-total-amount");
    const productListElement = document.querySelector(".store__product-list");
    const toastContainer = document.querySelector(".toast-container");

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

    // FUNCTION TO ATTACh EVENT LISTENERS TO "ADD TO BASKET" BUTTONS
    function attachAddToCartListeners() {
        document.querySelectorAll(".store__add-to-cart").forEach(button => {
            button.addEventListener("click", fucntion () {
                const productElement = this.parentElement;
                const productId = productElement.getAttribute("data-id");
                const productName = productElement.querySelector(".store__product-name").textContent;
                const productPrice = parseFloat(productElement.querySelector("store__product-price").textContent.replace('$', ''));
                const productImage = productElement.querySelector(".store__product-image").src;

                const existingProduct = cart.find(item => item.id === productId);

                if(existingProduct) {
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
        localStorage.setItem('cart', JSON.stringify(cart)); // SAVE THE CART TO localStorage
        checkoutCountElement.textContent = cart.reduce((acc, item) => acc + item.quantity, 0); // UPDATE CART COUNT
        updateCartPreview(); // UPDATE THE MINI-CART PREVIEW
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
            toast.addEventListener('transitioned', () => toast.remove());
        }, 3000);
    }

      // INITIAL RENDER AND UPDATE
      renderProducts(products);
      updateCart();
});