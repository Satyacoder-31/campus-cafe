const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { auth } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/menu - all food items with filters
router.get('/', async (req, res) => {
  try {
    const { category, search, isVeg, sort, minPrice, maxPrice } = req.query;
    const where = { isAvailable: true };
    if (category && category !== 'All') where.category = { name: category };
    if (isVeg === 'true') where.isVeg = true;
    if (isVeg === 'false') where.isVeg = false;
    if (search) where.name = { contains: search, mode: 'insensitive' };
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    let orderBy = { isSpecial: 'desc' };
    if (sort === 'price_asc') orderBy = { price: 'asc' };
    else if (sort === 'price_desc') orderBy = { price: 'desc' };
    else if (sort === 'rating') orderBy = { rating: 'desc' };
    else if (sort === 'popular') orderBy = { ratingCount: 'desc' };

    const items = await prisma.foodItem.findMany({
      where,
      orderBy,
      include: { category: true, reviews: { include: { user: { select: { name: true } } }, orderBy: { createdAt: 'desc' }, take: 5 } },
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/menu/categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({ orderBy: { sortOrder: 'asc' } });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/menu/specials
router.get('/specials', async (req, res) => {
  try {
    const specials = await prisma.foodItem.findMany({
      where: { isSpecial: true, isAvailable: true },
      include: { category: true },
      take: 6,
    });
    res.json(specials);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/menu/:id
router.get('/:id', async (req, res) => {
  try {
    const item = await prisma.foodItem.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { category: true, reviews: { include: { user: { select: { name: true, avatar: true } } }, orderBy: { createdAt: 'desc' } } },
    });
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/menu/:id/review
router.post('/:id/review', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const foodItemId = parseInt(req.params.id);
    const review = await prisma.review.create({
      data: { userId: req.user.id, foodItemId, rating: parseInt(rating), comment },
      include: { user: { select: { name: true } } },
    });
    // Update average rating
    const all = await prisma.review.findMany({ where: { foodItemId } });
    const avg = all.reduce((s, r) => s + r.rating, 0) / all.length;
    await prisma.foodItem.update({ where: { id: foodItemId }, data: { rating: avg, ratingCount: all.length } });
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Favorites
router.post('/:id/favorite', auth, async (req, res) => {
  try {
    const foodItemId = parseInt(req.params.id);
    const existing = await prisma.favorite.findUnique({ where: { userId_foodItemId: { userId: req.user.id, foodItemId } } });
    if (existing) {
      await prisma.favorite.delete({ where: { id: existing.id } });
      return res.json({ favorited: false });
    }
    await prisma.favorite.create({ data: { userId: req.user.id, foodItemId } });
    res.json({ favorited: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/user/favorites', auth, async (req, res) => {
  try {
    const favs = await prisma.favorite.findMany({
      where: { userId: req.user.id },
      include: { foodItem: { include: { category: true } } },
    });
    res.json(favs.map((f) => f.foodItem));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
