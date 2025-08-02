
document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const cartCountElement = document.getElementById('cart-count');
    const checkoutButton = document.querySelector('.btn.checkout');
    const addressModal = document.getElementById('address-modal');
    const closeModal = document.querySelector('.close');
    const addressForm = document.getElementById('address-form');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const gstRate = 18; // GST Percentage

    function updateCartCount() {
        const count = cart.reduce((total, item) => total + (item.quantity || 1), 0);
        cartCountElement.textContent = count;
    }

    function renderCartItems() {
        cartItemsContainer.innerHTML = '';
        let total = 0;

        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            const itemPrice = parseFloat(item.price.replace('₹', '').trim());

            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <span class="cart-item-name">${item.name}</span>
                <span class="cart-item-price">₹ ${item.price}</span>
                <div class="quantity-control">
                    <button class="quantity-btn" data-action="decrease" data-index="${index}">-</button>
                    <span class="cart-item-quantity">${item.quantity || 1}</span>
                    <button class="quantity-btn" data-action="increase" data-index="${index}">+</button>
                </div>
                <span class="cart-item-total">₹ ${(itemPrice * (item.quantity || 1)).toFixed(2)}</span>
                <button class="cart-item-remove" data-index="${index}">Remove</button>
            `;

            cartItemsContainer.appendChild(cartItem);
            total += itemPrice * (item.quantity || 1);
        });

        // Calculate GST and Grand Total
        const gstAmount = (total * gstRate) / 100;
        const grandTotal = total + gstAmount;

        // Update the total price display
        cartTotalPrice.innerHTML = `
            <p>Subtotal: ₹ ${total.toFixed(2)}</p>
            <p>GST (${gstRate}%): ₹ ${gstAmount.toFixed(2)}</p>
            <strong>Grand Total: ₹ ${grandTotal.toFixed(2)}</strong>
        `;

        localStorage.setItem('totalPrice', grandTotal.toFixed(2));
        updateCartCount();
    }

    renderCartItems();
    const emptyCartMessage = document.getElementById('empty-cart-message');

    if (cart.length === 0) {
        emptyCartMessage.style.display = 'block'; // Show empty cart message
    } else {
        emptyCartMessage.style.display = 'none'; // Hide empty cart message
    }
    
    cartItemsContainer.addEventListener('click', event => {
        if (event.target.classList.contains('cart-item-remove')) {
            const index = event.target.getAttribute('data-index');
            cart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCartItems();
        }

        if (event.target.classList.contains('quantity-btn')) {
            const index = event.target.getAttribute('data-index');
            const action = event.target.getAttribute('data-action');

            if (action === 'increase') {
                cart[index].quantity = (cart[index].quantity || 1) + 1;
            } else if (action === 'decrease' && cart[index].quantity > 1) {
                cart[index].quantity -= 1;
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            renderCartItems();
        }
    });

    checkoutButton.addEventListener('click', (event) => {
        event.preventDefault();
        addressModal.style.display = 'flex';
    });

    closeModal.addEventListener('click', () => {
        addressModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === addressModal) {
            addressModal.style.display = 'none';
        }
    });

    addressForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const fullName = document.getElementById('fullname').value.trim();
        const address = document.getElementById('address').value.trim();
        const city = document.getElementById('city').value.trim();
        const state = document.getElementById('state').value.trim();
        const pincode = document.getElementById('pincode').value.trim();
        const phone = document.getElementById('phone').value.trim();
        
        if (!fullName || !address || !city || !state || !pincode || !phone) {
            alert('All fields are required. Please fill out the form completely.');
            return;
        }

        if (!/^[0-9]{6}$/.test(pincode)) {
            alert('Please enter a valid 6-digit pincode.');
            return;
        }

        if (!/^[0-9]{10}$/.test(phone)) {
            alert('Please enter a valid 10-digit phone number.');
            return;
        }

        const addressData = { fullName, address, city, state, pincode, phone };

        try {
            const response = await fetch('http://localhost:5000/api/address/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(addressData)
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message);
                window.location.href = 'checkout.html';
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Something went wrong!');
        }
    });
});
