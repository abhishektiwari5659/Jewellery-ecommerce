# 💎 Jewellery e-Commerce

A full-stack e-commerce platform for buying and managing jewellery, built with Node.js, Express, MongoDB, and vanilla HTML/CSS/JS.

---

## 🧾 Features

- 🔐 User Signup & Login
- 🛍️ Product Listings & Filtering
- 🛒 Shopping Cart
- 💳 Secure Payments using Razorpay
- 🧑‍💼 Admin Dashboard (Add / Update / Delete products)
- 📤 Image Uploads & Email Integration via Nodemailer

---

## 🛠️ Tech Stack

### Frontend
- HTML, CSS, JavaScript

### Backend
- Node.js, Express.js

### Database
- MongoDB (via Mongoose)

### Libraries & APIs
- dotenv
- mongoose
- node-fetch
- nodemailer
- Razorpay

---

## 🔗 Folder Structure

jewellery-ecommerce/
├── admin/ # Admin dashboard files
├── client/ # Frontend website
├── server/ # Backend logic and API routes
│ ├── uploads/ # Uploaded product images (1.3GB+, excluded via .gitignore)
│ └── .env # Environment variables (not shared)
├── node_modules/ 
├── .gitignore
├── README.md


---

## ⚙️ Installation & Setup

> ⚠️ **Before starting**, ensure MongoDB is installed and running locally.

1. **Clone the repository**

git clone https://github.com/YOUR_USERNAME/jewellery-ecommerce.git
cd jewellery-ecommerce

2. **Install dependencies**

cd server
npm install

3. **Create your .env file**

Copy the example file and fill in your secrets:
cp .env.example .env

fill in values for:
PORT=5000
MONGO_URI=mongodb://localhost:27017/your-db
JWT_SECRET=your_jwt_key
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
IMGUR_CLIENT_ID=your_imgur_client_id
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password

4. **Start the server**

node server.js

5. **Open the frontend**

Open localhost:5000 in your browser.


# Environment Variables

The project uses environment variables stored in .env. See .env.example for reference.

# Contact
For any queries or collaboration requests:
📧 abhishekti5659@gmail.com
🔗 GitHub: @abhishektiwai5659
