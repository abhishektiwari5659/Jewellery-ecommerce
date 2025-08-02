
document.addEventListener('DOMContentLoaded', () => {
    const orderSummary = document.getElementById('order-summary');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalPrice = parseFloat(localStorage.getItem('totalPrice')) || 0;

    // Function to render the order summary
    function renderOrderSummary() {
        if (cart.length > 0) {
            orderSummary.innerHTML = cart.map(item => `
                <div class="order-item">
                    <img src="${item.image}" alt="${item.name}" class="order-item-image" style="width: 100px; height: auto;">
                    <p>${item.name}: Rs ${item.price} x ${item.quantity || 1}</p>
                </div>
            `).join('') + `
                <p><strong>Total Price: Rs ${totalPrice.toFixed(2)}</strong></p>
            `;
        } else {
            orderSummary.innerHTML = `<p>No items in the cart.</p>`;
        }
    }

    renderOrderSummary();

    document.getElementById('rzp-button1').addEventListener('click', function(e) {
        e.preventDefault();

        const amountInPaise = Math.round(totalPrice * 100); // Convert to paise properly

        fetch('/createOrder', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: amountInPaise })
        })
        .then(response => response.json())
        .then(data => {
            if (data && data.id) {
                const options = {
                    "key": "", // Replace with your test Key ID
                    "amount": data.amount,
                    "currency": "INR",
                    "name": "Jewelry Store",
                    "description": "Jewelry Purchase",
                    "image": "../images/logo.png",
                    "order_id": data.id,
                    "handler": function(response) {
                        const paymentDetails = {
                            payment_id: response.razorpay_payment_id,
                            order_id: response.razorpay_order_id,
                            signature: response.razorpay_signature,
                            cart: cart,
                            totalPrice: totalPrice,
                        };

                        fetch('/savePaymentDetails', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(paymentDetails)
                        })
                        .then(serverResponse => serverResponse.json())
                        .then(serverData => {
                            if (serverData.success) {
                                // Store order details in localStorage
                                localStorage.setItem('orderDetails', JSON.stringify(paymentDetails));

                                // Clear the cart
                                localStorage.removeItem('cart');
                                localStorage.removeItem('totalPrice');

                                // Update cart item count
                                const cartItemCount = document.getElementById('cart-item-count');
                                if (cartItemCount) cartItemCount.textContent = 0;

                                // Redirect to Thank You page
                                window.location.href = 'thankyou.html';
                            } else {
                                console.error('Error saving payment details:', serverData.message);
                            }
                        })
                        .catch(error => console.error('Error saving payment details:', error));
                    },
                    "prefill": {
                        "name": "Your Name",
                        "email": "your.email@example.com",
                        "contact": "9999999999"
                    },
                    "theme": { "color": "#F37254" }
                };
                const rzp1 = new Razorpay(options);
                rzp1.open();
            } else {
                console.error('Error in response:', data);
            }
        })
        .catch(error => console.error('Error:', error));
    });
});
