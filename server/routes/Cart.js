const express = require('express');
const router = express.Router();
const Cart = require('./models/Cart'); // Assume you have a Cart model

// Get cart data
router.get('/getCart', async (req, res) => {
    try {
        const userId = req.user.id; // Assuming user is authenticated
        const cart = await Cart.findOne({ userId });
        if (cart) {
            res.json({ cart: cart.items, totalPrice: cart.totalPrice });
        } else {
            res.json({ cart: [], totalPrice: 0 });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch cart data' });
    }
});

// Create order
router.post('/createOrder', async (req, res) => {
    try {
        const { amount } = req.body;
        // Create Razorpay order (use Razorpay SDK or API)
        const order = await razorpay.orders.create({
            amount,
            currency: 'INR'
        });
        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// Clear cart after payment
router.post('/clearCart', async (req, res) => {
    try {
        const userId = req.user.id;
        await Cart.deleteOne({ userId });
        res.json({ message: 'Cart cleared' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to clear cart' });
    }
});

module.exports = router;
