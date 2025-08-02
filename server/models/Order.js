import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    orderId: String,
    paymentId: String,
    signature: String,
    items: [
        {
            name: String,
            price: Number,
            quantity: Number,
            image: String
        }
    ],
    totalPrice: Number,
    customer: {
        name: String,
        email: String,
        contact: String
    },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Order', orderSchema);
