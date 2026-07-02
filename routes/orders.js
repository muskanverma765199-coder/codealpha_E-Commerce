const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');

// Middleware to check authentication
const isAuthenticated = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Authentication required. Please log in.' });
  }
  next();
};

// Place a new order
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Items array is required' });
    }
    if (!shippingAddress || !shippingAddress.trim()) {
      return res.status(400).json({ message: 'Shipping address is required' });
    }

    // Resolve prices and compute totalAmount on server-side for security
    const resolvedItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const dbProduct = await Product.findById(item.productId);
      if (!dbProduct) {
        return res.status(400).json({ message: `Product not found: ${item.productId}` });
      }
      
      const quantity = parseInt(item.quantity, 10);
      if (isNaN(quantity) || quantity <= 0) {
        return res.status(400).json({ message: 'Invalid product quantity' });
      }

      const itemCost = dbProduct.price * quantity;
      totalAmount += itemCost;

      resolvedItems.push({
        product: dbProduct._id,
        quantity: quantity,
        price: dbProduct.price
      });
    }

    const order = new Order({
      user: req.session.userId,
      items: resolvedItems,
      totalAmount,
      shippingAddress
    });

    await order.save();

    res.status(201).json({ 
      message: 'Order Successful!', 
      orderId: order._id,
      totalAmount
    });
  } catch (error) {
    res.status(500).json({ message: 'Error processing order', error: error.message });
  }
});

module.exports = router;
