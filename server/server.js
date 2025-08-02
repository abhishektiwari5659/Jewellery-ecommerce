
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import nodemailer from 'nodemailer';
import Razorpay from 'razorpay';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import addressRoutes from './routes/addressRoutes.js'; // Import address routes
import Product from './models/Product.js';
import Payment from './models/Payment.js';
import Customer from './models/Customer.js';
import Category from './models/Category.js';
import Order from "./models/Order.js"; // ✅ Import Order model
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const app = express();

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware to parse JSON requests
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Razorpay instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});
// ✅ Fetch all products
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});
// ✅ Fetch all categories
app.get("/api/categories", async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ error: "Failed to fetch categories" });
    }
});
// ✅ Fetch all orders
app.get("/api/orders", async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ error: "Failed to fetch orders" });
    }
});
// ✅ Fetch all customers
app.get('/api/customers', async (req, res) => {
    try {
        const customers = await Customer.find();
        res.json(customers);
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({ error: 'Failed to fetch customers' });
    }
});

// ✅ Fetch all payments
app.get('/api/payments', async (req, res) => {
    try {
        const payments = await Payment.find();
        res.json(payments);
    } catch (error) {
        console.error('Error fetching payments:', error);
        res.status(500).json({ error: 'Failed to fetch payments' });
    }
});

// Endpoint to create an order
app.post('/createOrder', async (req, res) => {
    const { amount } = req.body;
    const options = {
        amount,
        currency: 'INR',
        receipt: `receipt#${Date.now()}`
    };

    try {
        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// Endpoint to save payment details
app.post('/savePaymentDetails', async (req, res) => {
    const { payment_id, order_id, signature, cart, totalPrice } = req.body;

    try {
        const payment = new Payment({
            paymentId: payment_id,
            orderId: order_id,
            signature,
            items: cart,
            totalAmount: totalPrice,
            createdAt: new Date()
        });

        await payment.save();
        res.status(201).json({ success: true, message: 'Payment details saved successfully.' });
    } catch (error) {
        console.error('Error saving payment details:', error);
        res.status(500).json({ success: false, message: 'Failed to save payment details.' });
    }
});

// Get latest orderId
app.get('/getOrderId', async (req, res) => {
    try {
        const latestPayment = await Payment.findOne().sort({ createdAt: -1 });

        if (!latestPayment) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json({ orderId: latestPayment.orderId });
    } catch (error) {
        console.error('Error fetching orderId:', error);
        res.status(500).json({ error: 'Failed to retrieve orderId' });
    }
});

// Upload product with base64 image
app.post('/api/upload', async (req, res) => {
    try {
        const { name, description, price, base64Image } = req.body;

        if (!base64Image) {
            return res.status(400).json({ error: 'Image is required in base64 format' });
        }

        const imgurResponse = await fetch('https://api.imgur.com/3/image', {
            method: 'POST',
            headers: {
                Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ image: base64Image, type: 'base64' })
        });

        const imgurData = await imgurResponse.json();

        if (!imgurResponse.ok) {
            throw new Error('Imgur upload failed: ' + imgurData.data.error);
        }

        const newProduct = new Product({
            name,
            description,
            price,
            image: imgurData.data.link
        });

        await newProduct.save();
        res.status(201).json({ message: 'Product created successfully', product: newProduct });
    } catch (error) {
        console.error('Error uploading product:', error);
        res.status(500).json({ error: 'Failed to upload product' });
    }
});

// Contact form submission
app.post('/submit-contact', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).send('All fields are required.');
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: email,
        to: process.env.EMAIL_USER,
        subject: `Contact Form Submission from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send('Message sent successfully.');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Failed to send message.');
    }
});

// Serve static files
app.use(express.static(path.join(process.cwd(), '../client')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Delete product
app.delete('/api/products/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const result = await Product.findByIdAndDelete(productId);

        if (!result) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Failed to delete product' });
    }
});

// Routes
app.use('/api/products', productRoutes);
app.use('/api', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/address', addressRoutes); // Address routes added

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
