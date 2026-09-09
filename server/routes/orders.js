const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { auth } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

const generateOrderNumber = () => {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `CC-2026-${num}`;
};

// POST /api/orders - place order
router.post('/', auth, async (req, res) => {
  try {
    const { items, paymentMethod, couponCode, notes, pickupType, tableNumber } = req.body;
    if (!items || items.length === 0) return res.status(400).json({ error: 'Cart is empty' });

    // Validate items and compute total
    let subtotal = 0;
    const orderItems = [];
    for (const cartItem of items) {
      const food = await prisma.foodItem.findUnique({ where: { id: cartItem.id } });
      if (!food) return res.status(404).json({ error: `Item ${cartItem.id} not found` });
      if (!food.isAvailable) return res.status(400).json({ error: `${food.name} is currently unavailable` });
      const itemTotal = food.price * cartItem.quantity;
      subtotal += itemTotal;
      orderItems.push({ foodItemId: food.id, quantity: cartItem.quantity, price: food.price, addOns: JSON.stringify(cartItem.addOns || []) });
    }

    // Apply coupon
    let discount = 0;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({ where: { code: couponCode.toUpperCase() } });
      if (coupon && coupon.isActive && coupon.usedCount < coupon.usageLimit && subtotal >= coupon.minOrder) {
        discount = Math.min((subtotal * coupon.discount) / 100, coupon.maxDiscount || Infinity);
        await prisma.coupon.update({ where: { id: coupon.id }, data: { usedCount: { increment: 1 } } });
      }
    }

    const tax = Math.round((subtotal - discount) * 0.05 * 100) / 100;
    const total = subtotal - discount + tax;

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: req.user.id,
        paymentMethod,
        paymentStatus: paymentMethod === 'cash' ? 'pending' : 'paid',
        subtotal,
        tax,
        discount,
        total,
        couponCode,
        notes,
        pickupType,
        tableNumber,
        estimatedTime: 15,
        items: { create: orderItems },
      },
      include: { items: { include: { foodItem: true } }, user: { select: { name: true, collegeId: true } } },
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/orders/me - my orders
router.get('/me', auth, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: { items: { include: { foodItem: { include: { category: true } } } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/orders/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { items: { include: { foodItem: true } }, user: { select: { name: true, collegeId: true } } },
    });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.userId !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ error: 'Forbidden' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/orders/track/:orderNumber
router.get('/track/:orderNumber', auth, async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { orderNumber: req.params.orderNumber },
      include: { items: { include: { foodItem: true } } },
    });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
