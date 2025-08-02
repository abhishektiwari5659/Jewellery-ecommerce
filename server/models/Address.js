import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
    fullName: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    pincode: { type: String, required: true, trim: true, match: /^[0-9]{6}$/ },
    phone: { type: String, required: true, trim: true, match: /^[0-9]{10}$/ }
}, { timestamps: true });

const Address = mongoose.model('Address', addressSchema);
export default Address;
