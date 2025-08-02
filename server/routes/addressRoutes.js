import express from 'express';
import Address from '../models/Address.js';

const router = express.Router();

// Save Address
router.post('/save', async (req, res) => {
    try {
        const { fullName, address, city, state, pincode, phone } = req.body;

        // Validate inputs
        if (!fullName || !address || !city || !state || !pincode || !phone) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        if (!/^[0-9]{6}$/.test(pincode)) {
            return res.status(400).json({ success: false, message: "Invalid Pincode format" });
        }

        if (!/^[0-9]{10}$/.test(phone)) {
            return res.status(400).json({ success: false, message: "Invalid Phone Number format" });
        }

        const newAddress = new Address({ fullName, address, city, state, pincode, phone });
        await newAddress.save();

        res.status(201).json({ success: true, message: "Address saved successfully!", address: newAddress });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error saving address", error: error.message });
    }
});

export default router;
