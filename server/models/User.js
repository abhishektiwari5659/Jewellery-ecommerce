import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Name is required'],
        minlength: [3, 'Name must be at least 3 characters long']
    },
    email: { 
        type: String, 
        required: [true, 'Email is required'], 
        unique: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address'] 
    },
    password: { 
        type: String, 
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long']
    },
});

// Hash the password before saving the user
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Match user-entered password to hashed password in the database
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', UserSchema); // Use default export
