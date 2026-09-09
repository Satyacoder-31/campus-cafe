require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const menuRoutes = require('./routes/menu');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');
const couponRoutes = require('./routes/coupons');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────
const allowedOrigins = [
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return cb(null, true);
    // Allow localhost (any port)
    if (/^https?:\/\/localhost(:\d+)?$/.test(origin)) return cb(null, true);
    // Allow Vercel preview & production deployments
    if (/\.vercel\.app$/.test(origin)) return cb(null, true);
    // Allow explicitly configured CLIENT_URL
    if (allowedOrigins.includes(origin)) return cb(null, true);
    cb(null, true); // Fallback allow to avoid unexpected deployment blocks
  },
  credentials: true,
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Routes ────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/coupons', couponRoutes);

// ── Health check ──────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Campus Café API is running 🎉', time: new Date().toISOString() });
});

// ── 404 handler ───────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ── Error handler ─────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`\n☕  Campus Café API running at http://localhost:${PORT}`);
  console.log(`📋  Health: http://localhost:${PORT}/api/health\n`);
});
