import express from 'express';
import Product from '../models/Product.js'; // Adjust path as needed
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Multer setup for handling file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Specify the destination directory for uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Save file with a unique name
    },
});
const upload = multer({ storage });

// Route to add a product with an image
router.post('/add-product', upload.single('image'), async (req, res) => {
    try {
        const { name, description, price } = req.body;

        // Create a URL for the uploaded image
        const imageUrl = `/uploads/${req.file.filename}`; // Correctly set the image URL

        // Create a new product with the image URL
        const newProduct = new Product({
            name,
            description,
            price,
            image: imageUrl, // Save image URL as a string
        });

        await newProduct.save();
        res.status(201).json({ message: 'Product saved successfully!' });
    } catch (error) {
        console.error('Error saving product:', error);
        res.status(500).json({ error: 'Error saving product' });
    }
});

// Route to get a product by ID
router.get('/:id', async (req, res) => {
    console.log('Fetching product with ID:', req.params.id); // Log here
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Error fetching product' });
    }
});

// Route to get all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find(); // Fetch all products from DB
        res.status(200).json(products); // Return the products in JSON format
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Error fetching products' });
    }
});

export default router; // Default export
