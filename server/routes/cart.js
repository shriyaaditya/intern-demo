const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');
const router = express.Router();


router.get('/', protect, async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate('items.product');

    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [], totalAmount: 0 });
    }

    res.json({ success: true, cart });
  } catch (error) {
    next(error);
  }
});


router.post('/add', protect, async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ success: false, message: 'Not enough stock available' });
    }

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

//existing item
    if (itemIndex > -1) {
      const newQuantity = cart.items[itemIndex].quantity + Number(quantity);
      if (product.stock < newQuantity) {
        return res.status(400).json({ success: false, message: 'Not enough stock available' });
      }
      cart.items[itemIndex].quantity = newQuantity;
    } else {
      // add new item
      cart.items.push({
        product: productId,
        quantity: Number(quantity),
        price: product.price
      });
    }

    await cart.save();
    cart = await Cart.findOne({ user: req.user.id }).populate('items.product');

    res.json({ success: true, cart });
  } catch (error) {
    next(error);
  }
});


router.put('/update/:itemId', protect, async (req, res, next) => {
  try {
    const { quantity } = req.body;

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(item => item._id.toString() === req.params.itemId);
    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      const product = await Product.findById(cart.items[itemIndex].product);
      if (product && product.stock < quantity) {
        return res.status(400).json({ success: false, message: 'Not enough stock available' });
      }
      cart.items[itemIndex].quantity = Number(quantity);
    }

    await cart.save();
    cart = await Cart.findOne({ user: req.user.id }).populate('items.product');

    res.json({ success: true, cart });
  } catch (error) {
    next(error);
  }
});

router.delete('/remove/:itemId', protect, async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item._id.toString() !== req.params.itemId);
    await cart.save();

    cart = await Cart.findOne({ user: req.user.id }).populate('items.product');

    res.json({ success: true, cart });
  } catch (error) {
    next(error);
  }
});

router.delete('/clear', protect, async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }


    cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [], totalAmount: 0 });
    }

    res.json({ success: true, message: 'Cart cleared', cart });
  } catch (error) {
    next(error);
  }
});

module.exports = router;