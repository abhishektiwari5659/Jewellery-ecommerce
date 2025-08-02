import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

// Save Order After Payment
router.post("/savePaymentDetails", async (req, res) => {
    try {
        const { payment_id, order_id, signature, cart, totalPrice } = req.body;

        if (!cart || cart.length === 0) {
            return res.status(400).json({ success: false, message: "Cart is empty" });
        }

        const newOrder = new Order({
            orderId: order_id,
            paymentId: payment_id,
            signature: signature,
            items: cart,
            totalPrice: totalPrice,
            customer: {
                name: "Your Name",
                email: "your.email@example.com",
                contact: "9999999999"
            }
        });

        await newOrder.save();
        res.json({ success: true, orderId: order_id });
    } catch (error) {
        console.error("Error saving order:", error);
        res.status(500).json({ success: false, message: "Error saving order" });
    }
});

// Fetch Order Details
router.get("/:orderId", async (req, res) => {
    try {
        const order = await Order.findOne({ orderId: req.params.orderId });

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        res.json({ success: true, order });
    } catch (error) {
        console.error("Error fetching order:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

export default router;
