const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/coupons/validate
router.post('/validate', async (req, res) => {
  try {
    const { code, subtotal } = req.body;
    const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });
    if (!coupon || !coupon.isActive) return res.status(404).json({ error: 'Invalid coupon code' });
    if (coupon.expiresAt && new Date() > coupon.expiresAt) return res.status(400).json({ error: 'Coupon has expired' });
    if (coupon.usedCount >= coupon.usageLimit) return res.status(400).json({ error: 'Coupon usage limit reached' });
    if (subtotal < coupon.minOrder) return res.status(400).json({ error: `Minimum order amount is ₹${coupon.minOrder}` });

    const discount = Math.min((subtotal * coupon.discount) / 100, coupon.maxDiscount || Infinity);
    res.json({ valid: true, discount, coupon: { code: coupon.code, discountPercent: coupon.discount, maxDiscount: coupon.maxDiscount } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
