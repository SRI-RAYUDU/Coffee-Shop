document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.querySelector('#menu-btn');
  const searchBtn = document.querySelector('#search-btn');
  const cartBtn = document.querySelector('#cart-btn');
  const searchBox = document.querySelector('#search-box');
  const searchIcon = document.querySelector('#search-icon');
  const navbar = document.querySelector('.navbar');
  const searchForm = document.querySelector('.search-form');
  const suggestionsContainer = document.getElementById('suggestions');
  const cartContainer = document.querySelector('.cart-items-container');
  const cartItemsContainer = document.querySelector(
    '.cart-items-container .cart-items'
  );
  const cartItemCount = document.querySelector('#cart-item-count');
  const cartTotalPrice = document.querySelector('#cart-total-price');
  const checkoutBtn = document.querySelector('#checkout-btn');
  const addToCartButtons = document.querySelectorAll('.menu .box .btn');
  const productCartLinks = document.querySelectorAll(
    '.products .box .fas.fa-shopping-cart'
  );
  const shareLinks = document.querySelectorAll('.products .box .fas.fa-share');
  const eyeIcons = document.querySelectorAll('.products .box .fas.fa-eye');

  const contactNowBtn = document.querySelector('#contact-now-btn');
  const form = document.querySelector('#contactForm');
  const successMessage = document.querySelector('#successMessage');

  let totalItems = 0;
  let totalPrice = 0;

  function closeAll() {
    navbar.classList.remove('active');
    searchForm.classList.remove('active');
    cartContainer.classList.remove('active');
    suggestionsContainer.innerHTML = '';
    suggestionsContainer.style.display = 'none';
  }

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

  function updateCartInfo() {
    cartItemCount.textContent = totalItems;
    cartTotalPrice.textContent = `₹${totalPrice.toFixed(2)}`;
  }

  function addToCart(itemName, itemPrice, itemImageSrc) {
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');
    cartItem.innerHTML = `
      <span class="fas fa-times remove-item"></span>
      <img src="${itemImageSrc}" alt="${itemName}" style="width: 100px; height: auto; max-height: 100px; object-fit: cover;">
      <div class="content" style="display: flex; flex-direction: column; align-items: center; margin-top: 10px;">
        <h3>${itemName}</h3>
        <div class="price">₹${itemPrice.toFixed(2)}</div>
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

  addToCartButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      const itemBox = event.target.closest('.box');
      const itemName = itemBox.querySelector('h3').textContent;
      const itemPrice = parseFloat(
        itemBox.querySelector('.price').textContent.replace('₹', '')
      );
      const itemImageSrc = itemBox.querySelector('img').src;
      addToCart(itemName, itemPrice, itemImageSrc);
    });
  });

  productCartLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const productBox = event.target.closest('.box');
      const itemName = productBox.querySelector('h3').textContent;
      const itemPrice = parseFloat(
        productBox.querySelector('.price').textContent.replace('₹', '')
      );
      const itemImageSrc = productBox.querySelector('img').src;
      addToCart(itemName, itemPrice, itemImageSrc);
    });
  });

  shareLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      alert('Share to Button');
    });
  });

  function toggleProductContent(productBox) {
    const content = productBox.querySelector('.content');
    const image = productBox.querySelector('.image');
    const stars = productBox.querySelector('.stars');
    const price = productBox.querySelector('.price');

    const isVisible = content.style.display !== 'none';

    content.style.display = isVisible ? 'none' : 'block';
    image.style.display = isVisible ? 'none' : 'block';
    stars.style.display = isVisible ? 'none' : 'block';
    price.style.display = isVisible ? 'none' : 'block';
  }

  eyeIcons.forEach((icon) => {
    icon.addEventListener('click', (e) => {
      const productBox = e.target.closest('.box');
      toggleProductContent(productBox);
    });
  });

  function searchMenuItems() {
    const searchQuery = searchBox.value.trim().toLowerCase();
    suggestionsContainer.innerHTML = '';
    suggestionsContainer.style.display = 'none';

    if (searchQuery) {
      const menuItems = document.querySelectorAll('.menu .box');
      const foundItems = Array.from(menuItems).filter((item) => {
        const itemName = item.querySelector('h3').textContent.toLowerCase();
        return itemName.includes(searchQuery);
      });

      if (foundItems.length > 0) {
        suggestionsContainer.style.display = 'block';
        foundItems.forEach((item) => {
          const suggestionItem = document.createElement('div');
          suggestionItem.classList.add('suggested-item');
          const mainPrice = item
            .querySelector('.price')
            .childNodes[0].textContent.trim();

          suggestionItem.innerHTML = `
            <img src="${item.querySelector('img').src}" alt="${
            item.querySelector('h3').textContent
          }">
            <h3>${item.querySelector('h3').textContent}</h3>
            <div class="price">${mainPrice}</div>
          `;
          suggestionsContainer.appendChild(suggestionItem);
        });
      } else {
        suggestionsContainer.innerHTML = '<p>No matching items found.</p>';
        suggestionsContainer.style.display = 'block';
      }
    }
  }

  searchIcon.addEventListener('click', searchMenuItems);

  searchBox.addEventListener('input', searchMenuItems);

  checkoutBtn.addEventListener('click', () => {
    let totalPriceInCart = 0;
    const cartItems = cartItemsContainer.querySelectorAll('.cart-item');
    cartItems.forEach((item) => {
      const price = parseFloat(
        item.querySelector('.price').textContent.replace('₹', '')
      );
      totalPriceInCart += price;
    });

    const totalPriceContainer = document.querySelector(
      '.cart-items-container .total-price'
    );
    if (totalPriceContainer) {
      totalPriceContainer.textContent = `Total Price: ₹${totalPriceInCart.toFixed(
        2
      )}`;
    } else {
      const newTotalPriceContainer = document.createElement('div');
      newTotalPriceContainer.classList.add('total-price');
      newTotalPriceContainer.textContent = `Total Price: ₹${totalPriceInCart.toFixed(
        2
      )}`;
      cartContainer.appendChild(newTotalPriceContainer);
    }
  });

  contactNowBtn.addEventListener('click', () => {
    form.style.display = 'block';
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    successMessage.style.display = 'block';
    successMessage.textContent = 'Success! We will get back to you.';
    successMessage.classList.add('alert-style');

    setTimeout(() => {
      successMessage.style.display = 'none';
    }, 3000);

    form.reset();
  });
});
