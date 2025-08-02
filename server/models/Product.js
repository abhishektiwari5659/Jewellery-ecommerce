import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true }, // Store image URL as a string
}, {
    timestamps: true // Optional: Automatically manage createdAt and updatedAt timestamps
});

const Product = mongoose.model('Product', productSchema);

// Export as default
export default Product;
