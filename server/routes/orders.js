const express = require('express');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

// @route   POST /api/orders
// @desc    Create order from cart
// @access  Private
router.post('/', protect, async (req, res, next) => {
  try {
    const { shippingAddress } = req.body;

    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    // Check stock and prepare order items
    const orderItems = [];
    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);
      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          success: false, 
          message: `Not enough stock for ${product.name}. Available: ${product.stock}` 
        });
      }

      // Reduce stock
      product.stock -= item.quantity;
      await product.save();

      orderItems.push({
        product: item.product._id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.price,
        image: item.product.images[0]
      });
    }

    // Create order
    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      shippingAddress,
      totalAmount: cart.totalAmount
    });

    // Clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json({ success: true, order });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/orders
// @desc    Get user's orders
// @access  Private
router.get('/', protect, async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate('items.product', 'name images');

    res.json({ success: true, orders });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
router.get('/:id', protect, async (req, res, next) => {
  try {
    const order = await Order.findOne({ 
      _id: req.params.id, 
      user: req.user.id 
    }).populate('items.product');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/orders/admin/all
// @desc    Get all orders (Admin)
// @access  Private/Admin
router.get('/admin/all', protect, adminOnly, async (req, res, next) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate('user', 'name email')
      .populate('items.product', 'name');

    res.json({ success: true, orders });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status (Admin)
// @access  Private/Admin
router.put('/:id/status', protect, adminOnly, async (req, res, next) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.status = status;
    await order.save();

    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
});

module.exports = router;