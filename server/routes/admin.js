const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { auth, adminOnly } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const router = express.Router();
const prisma = new PrismaClient();

// File upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

router.use(auth, adminOnly);

// ── Dashboard ─────────────────────────────────────────────────

router.get('/dashboard', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalOrders, todayOrders, pendingOrders, completedOrders, totalItems, lowStockItems] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { createdAt: { gte: today } } }),
      prisma.order.count({ where: { status: { in: ['placed', 'confirmed', 'preparing'] } } }),
      prisma.order.count({ where: { status: 'completed', createdAt: { gte: today } } }),
      prisma.foodItem.count({ where: { isAvailable: true } }),
      prisma.inventory.count({ where: { currentStock: { lte: prisma.inventory.fields.minStock } } }),
    ]);

    // Today's revenue
    const todayRevenue = await prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { not: 'cancelled' }, createdAt: { gte: today } },
    });

    // Weekly sales (last 7 days)
    const weekly = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const end = new Date(d);
      end.setHours(23, 59, 59, 999);
      const result = await prisma.order.aggregate({
        _sum: { total: true },
        _count: true,
        where: { createdAt: { gte: d, lte: end }, status: { not: 'cancelled' } },
      });
      weekly.push({
        date: d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' }),
        revenue: result._sum.total || 0,
        orders: result._count,
      });
    }

    // Top 5 items by order count
    const topItems = await prisma.orderItem.groupBy({
      by: ['foodItemId'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    });
    const topItemsWithNames = await Promise.all(
      topItems.map(async (item) => {
        const food = await prisma.foodItem.findUnique({ where: { id: item.foodItemId } });
        return { name: food.name, count: item._sum.quantity };
      })
    );

    res.json({
      stats: { totalOrders, todayOrders, pendingOrders, completedOrders, totalItems, lowStockItems, todayRevenue: todayRevenue._sum.total || 0 },
      weekly,
      topItems: topItemsWithNames,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Orders Management ─────────────────────────────────────────

router.get('/orders', async (req, res) => {
  try {
    const { status, date, search } = req.query;
    const where = {};
    if (status && status !== 'all') where.status = status;
    if (date) {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      const end = new Date(d);
      end.setHours(23, 59, 59, 999);
      where.createdAt = { gte: d, lte: end };
    }
    if (search) where.orderNumber = { contains: search };

    const orders = await prisma.order.findMany({
      where,
      include: { user: { select: { name: true, collegeId: true } }, items: { include: { foodItem: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['placed', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) return res.status(400).json({ error: 'Invalid status' });
    const order = await prisma.order.update({ where: { id: parseInt(req.params.id) }, data: { status } });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Menu Management ───────────────────────────────────────────

router.get('/menu', async (req, res) => {
  try {
    const items = await prisma.foodItem.findMany({ include: { category: true }, orderBy: { createdAt: 'desc' } });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/menu', upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, categoryId, isVeg, calories, ingredients, addOns, isSpecial } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : req.body.image;
    const item = await prisma.foodItem.create({
      data: {
        name, description, price: parseFloat(price), categoryId: parseInt(categoryId),
        isVeg: isVeg === 'true', calories: calories ? parseInt(calories) : null,
        ingredients, addOns, isSpecial: isSpecial === 'true', image,
      },
      include: { category: true },
    });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/menu/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, categoryId, isVeg, isAvailable, calories, ingredients, addOns, isSpecial } = req.body;
    const data = { name, description, price: parseFloat(price), categoryId: parseInt(categoryId), isVeg: isVeg === 'true', isAvailable: isAvailable !== 'false', isSpecial: isSpecial === 'true' };
    if (calories) data.calories = parseInt(calories);
    if (ingredients) data.ingredients = ingredients;
    if (addOns) data.addOns = addOns;
    if (req.file) data.image = `/uploads/${req.file.filename}`;
    else if (req.body.image) data.image = req.body.image;

    const item = await prisma.foodItem.update({ where: { id: parseInt(req.params.id) }, data, include: { category: true } });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/menu/:id', async (req, res) => {
  try {
    await prisma.foodItem.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Inventory ─────────────────────────────────────────────────

router.get('/inventory', async (req, res) => {
  try {
    const inventory = await prisma.inventory.findMany({ include: { foodItem: { select: { name: true } } }, orderBy: { currentStock: 'asc' } });
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/inventory/:id', async (req, res) => {
  try {
    const { currentStock, minStock } = req.body;
    const item = await prisma.inventory.update({ where: { id: parseInt(req.params.id) }, data: { currentStock: parseFloat(currentStock), minStock: parseFloat(minStock) } });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Users Management ──────────────────────────────────────────

router.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { role: 'student' },
      select: { id: true, name: true, collegeId: true, email: true, phone: true, createdAt: true, _count: { select: { orders: true } } },
      orderBy: { createdAt: 'desc' },
    });
    const usersWithSpend = await Promise.all(
      users.map(async (u) => {
        const spend = await prisma.order.aggregate({ _sum: { total: true }, where: { userId: u.id, status: { not: 'cancelled' } } });
        return { ...u, totalSpend: spend._sum.total || 0 };
      })
    );
    res.json(usersWithSpend);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
