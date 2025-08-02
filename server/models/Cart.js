const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    items: [
        {
            name: String,
            image: String,
            price: Number,
            quantity: { type: Number, default: 1 }
        }
    ],
    totalPrice: { type: Number, default: 0 }
});

module.exports = mongoose.model('Cart', CartSchema);
