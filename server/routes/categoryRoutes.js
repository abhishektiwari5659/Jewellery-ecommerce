import express from 'express';
import Category from '../models/Category.js'; // Assuming you have a Category model

const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch categories' });
    }
});

// Create a new category
router.post('/', async (req, res) => {
    const { name, description } = req.body;

    try {
        const newCategory = new Category({ name, description });
        const savedCategory = await newCategory.save();
        res.json(savedCategory);
    } catch (error) {
        res.status(400).json({ message: 'Failed to create category' });
    }
});

// Update a category
router.put('/:id', async (req, res) => {
    const { name, description } = req.body;

    try {
        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            { name, description },
            { new: true }
        );
        res.json(updatedCategory);
    } catch (error) {
        res.status(400).json({ message: 'Failed to update category' });
    }
});

// Delete a category
router.delete('/:id', async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.sendStatus(200);
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete category' });
    }
});

export default router; // Default export
