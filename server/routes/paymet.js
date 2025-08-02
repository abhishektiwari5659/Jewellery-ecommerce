const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment.js'); // Assume you have a Payment schema

router.post('/savePaymentDetails', async (req, res) => {
    try {
        const { payment_id, order_id, signature, cart, totalPrice } = req.body;

        // Save payment details to the database
        const payment = new Payment({
            paymentId: payment_id,
            orderId: order_id,
            signature: signature,
            items: cart,
            totalAmount: totalPrice,
            createdAt: new Date()
        });

        await payment.save();

        res.status(200).json({ success: true, message: 'Payment details saved successfully.' });
    } catch (error) {
        console.error('Error saving payment details:', error);
        res.status(500).json({ success: false, message: 'Failed to save payment details.' });
    }
});

// Example route to fetch order details
app.get('/getOrderId', async (req, res) => {
    try {
        // Find the latest order in the database (or you can filter by user or payment status)
        const latestPayment = await Payment.findOne().sort({ createdAt: -1 });  // Get the latest payment

        if (!latestPayment) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Send the orderId back to the client
        res.json({ orderId: latestPayment.orderId });
    } catch (error) {
        console.error('Error fetching orderId:', error);
        res.status(500).json({ error: 'Failed to retrieve orderId' });
    }
});


module.exports = router;
