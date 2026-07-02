# 🛒 KartVibe — Modern E-Commerce Platform

KartVibe is a minimalist, responsive, and fully functional full-stack e-commerce web application inspired by platforms like Flipkart. It features a robust Node.js/Express.js backend, a MongoDB database, secure session-based authentication, and a clean, premium vanilla HTML/CSS/JS frontend styled with modern typography, custom properties, and smooth UI micro-interactions.

---

## 🚀 Key Features

- **🔐 Secure User Authentication**: Email & password-based registration and login system with cryptographic password hashing (using native `crypto`) and express-session state management.
- **📦 Dynamic Product Catalog**: Displays curated products segmented into three distinct sections:
  - **Featured Products**: Highlights premium items.
  - **Trending Products**: Showcases popular or high-demand products.
  - **Top Sales / Offers**: Features discounted products complete with original price strikethroughs and percentage-off badges.
- **🔍 Product Details Page**: Displays rich product descriptions, specifications, pricing, and an direct "Add to Cart" option.
- **🛒 Interactive Shopping Cart**: Supports real-time price calculations, item quantity adjustment, delivery charge computations (FREE for orders above ₹5,000, else ₹150), and persistent cart storage using `localStorage`.
- **💳 Order Checkout Flow**: Order summary validation, delivery address verification, and secure transaction simulation.
- **🇮🇳 Rupee Currency Integration (₹)**: Full support for the Indian Rupee currency prefix and standard Indian numbering system formatting (e.g., `₹1,49,900` or `₹29,990`) across the entire store interface.
- **🌱 Seeded Database**: Automatically pre-populates MongoDB with 14 high-quality products using Unsplash images.

---

## 🛠️ Technology Stack

### Frontend
- **HTML5 & CSS3**: Responsive grid layout, flexbox alignment, customized Google Fonts (Inter), and glassmorphism cards.
- **JavaScript (ES6+)**: Custom dynamic client-side rendering, cart persistence, state synchronization, and DOM manipulation.

### Backend
- **Node.js & Express.js**: RESTful API routing, static file hosting, and secure server-side session management.
- **MongoDB & Mongoose**: Object Data Modeling (ODM) for database models.
- **Crypto (Native)**: Standard SHA-256 password hashing.
- **Express Session**: Handles logged-in state across pages securely.

---

## 📂 Folder Structure

```
ecommerce/
├── config/
│   └── db.js            # MongoDB database connection configuration
├── models/
│   ├── User.js          # User schema (email, password)
│   ├── Product.js       # Product schema (name, price, tag, category, originalPrice)
│   └── Order.js         # Order schema (user, items, total, shippingAddress)
├── routes/
│   ├── auth.js          # Authentication routes (/register, /login, /logout, /me)
│   ├── products.js      # Product catalog routes (list all, retrieve by ID)
│   └── orders.js        # Checkout and order placement routes
├── public/              # Static frontend assets
│   ├── css/
│   │   └── style.css    # Global stylesheet with modern themes and transitions
│   ├── js/
│   │   └── main.js      # Frontend controller managing auth, cart, and page loads
│   ├── index.html       # Store home page
│   ├── product.html     # Product details view
│   ├── cart.html        # Shopping cart page
│   ├── checkout.html    # Checkout confirmation page
│   ├── login.html       # Login form page
│   └── register.html    # Signup form page
├── .env                 # Port, database URL, and session secrets
├── .gitignore           # Ignores local nodes, env, and temporary cache files
├── package.json         # Project manifests and dependencies
├── seed.js              # Database populator script
└── server.js            # Main Express server entry point
```

---

## ⚙️ Setup & Installation

### 📋 Prerequisites
- **Node.js** (v18.x or higher)
- **MongoDB** running locally (`mongodb://localhost:27017`) or a remote MongoDB Atlas URI.

### 🔌 Steps to Run Locally

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/muskanverma765199-coder/codealpha_E-Commerce.git
   cd codealpha_E-Commerce
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/ecommerce
   SESSION_SECRET=kartvibe_ecommerce_secret_key_9876
   ```

4. **Seed the Database**:
   Pre-populate the database with the product catalog items:
   ```bash
   npm run seed
   ```

5. **Start the server**:
   ```bash
   npm start
   ```
   The application will run on **[http://localhost:5000](http://localhost:5000)**.