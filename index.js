// Selectors for menu, search, and cart
const menuBtn = document.querySelector('#menu-btn');
const searchBtn = document.querySelector('#search-btn');
const cartBtn = document.querySelector('#cart-btn');
const searchBox = document.querySelector('#search-box');
const navbar = document.querySelector('.navbar');
const searchForm = document.querySelector('.search-form');
const cartContainer = document.querySelector('.cart-items-container');
const cartItemsContainer = document.querySelector('.cart-items-container .cart-items');
const cartItemCount = document.querySelector('#cart-item-count');
const cartTotalPrice = document.querySelector('#cart-total-price');
const checkoutBtn = document.querySelector('#checkout-btn');
const addToCartButtons = document.querySelectorAll('.menu .box .btn');
const menuItems = document.querySelectorAll('.menu .box');
const searchResultsContainer = document.createElement('div'); // Container for search results

searchResultsContainer.classList.add('search-results');
searchForm.appendChild(searchResultsContainer);

// Variables for tracking cart data
let totalItems = 0;
let totalPrice = 0;

// Utility to close all active elements
function closeAll() {
    navbar.classList.remove('active');
    searchForm.classList.remove('active');
    cartContainer.classList.remove('active');
    searchResultsContainer.innerHTML = ''; // Clear search results on close
}

// Event listeners for toggle buttons
menuBtn.addEventListener('click', () => {
    const isActive = navbar.classList.contains('active');
    closeAll();
    if (!isActive) navbar.classList.add('active');
});

searchBtn.addEventListener('click', () => {
    const isActive = searchForm.classList.contains('active');
    closeAll();
    if (!isActive) searchForm.classList.add('active');
});

cartBtn.addEventListener('click', () => {
    const isActive = cartContainer.classList.contains('active');
    closeAll();
    if (!isActive) cartContainer.classList.add('active');
    updateCartInfo();
});

// Close all active elements on clicking outside
document.addEventListener('click', (event) => {
    if (
        !event.target.closest('.navbar') &&
        !event.target.closest('.search-form') &&
        !event.target.closest('.cart-items-container') &&
        !event.target.closest('.icons')
    ) {
        closeAll();
    }
});

// Function to add an item to the cart
function addToCart(event) {
    const itemBox = event.target.closest('.box');
    const itemName = itemBox.querySelector('h3').textContent;
    const itemPrice = parseFloat(itemBox.querySelector('.price').textContent.replace('$', ''));
    const itemImageSrc = itemBox.querySelector('img').src;

    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');
    cartItem.innerHTML = `
        <span class="fas fa-times remove-item"></span>
        <img src="${itemImageSrc}" alt="${itemName}">
        <div class="content">
            <h3>${itemName}</h3>
            <div class="price">$${itemPrice.toFixed(2)}</div>
        </div>
    `;

    cartItemsContainer.appendChild(cartItem);
    totalItems++;
    totalPrice += itemPrice;

    checkoutBtn.style.display = totalItems > 0 ? 'block' : 'none';

    cartItem.querySelector('.remove-item').addEventListener('click', () => {
        cartItem.remove();
        totalItems--;
        totalPrice -= itemPrice;
        updateCartInfo();
        if (totalItems === 0) checkoutBtn.style.display = 'none';
    });

    updateCartInfo();
}

// Update cart information
function updateCartInfo() {
    cartItemCount.textContent = totalItems;
    cartTotalPrice.textContent = `$${totalPrice.toFixed(2)}`;
}

// Event listener for "Add to Cart" buttons
addToCartButtons.forEach(button => {
    button.addEventListener('click', addToCart);
});

// Filter menu items based on the first letter of the search input
function filterMenuItems() {
    const query = searchBox.value.toLowerCase();
    searchResultsContainer.innerHTML = ''; // Clear previous results

    if (query.length === 1) { // Match only the first letter
        menuItems.forEach(item => {
            const itemName = item.querySelector('h3').textContent.toLowerCase();
            if (itemName.startsWith(query)) {
                const result = document.createElement('div');
                result.classList.add('search-result-item');
                result.textContent = item.querySelector('h3').textContent;
                searchResultsContainer.appendChild(result);

                // Add click event to focus on the item
                result.addEventListener('click', () => {
                    item.scrollIntoView({ behavior: 'smooth', block: 'center' });
                });
            }
        });
    }
}

// Event listener for search box input
searchBox.addEventListener('input', filterMenuItems);
