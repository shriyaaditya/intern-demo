const express = require('express');
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');
const { ensureFakeStoreProductsInDb } = require('../utils/fakeStoreSync');
const router = express.Router();


router.get('/', async (req, res, next) => {
  try {
    await ensureFakeStoreProductsInDb();

    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 12));

    const filter = {};
    if (req.query.category) {
      filter.category = req.query.category;
    }
    if (req.query.search && String(req.query.search).trim()) {
      const safe = String(req.query.search).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [
        { name: new RegExp(safe, 'i') },
        { description: new RegExp(safe, 'i') }
      ];
    }
    if (req.query.minPrice || req.query.maxPrice) {
      const priceRange = {};
      const minP = Number(req.query.minPrice);
      const maxP = Number(req.query.maxPrice);
      if (req.query.minPrice && Number.isFinite(minP)) priceRange.$gte = minP;
      if (req.query.maxPrice && Number.isFinite(maxP)) priceRange.$lte = maxP;
      if (Object.keys(priceRange).length > 0) filter.price = priceRange;
    }

    let sort = { createdAt: -1 };
    if (req.query.sort === 'price-asc') sort = { price: 1 };
    else if (req.query.sort === 'price-desc') sort = { price: -1 };
    else if (req.query.sort === 'name') sort = { name: 1 };

    const skip = (page - 1) * limit;
    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter).sort(sort).skip(skip).limit(limit);

    res.json({
      success: true,
      products,
      pagination: {
        page,
        pages: Math.max(1, Math.ceil(total / limit)),
        total,
        limit
      }
    });
  } catch (error) {
    next(error);
  }
});




router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await product.deleteOne();
    res.json({ success: true, message: 'Product removed' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;