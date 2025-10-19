require('dotenv').config(); // lee .env
const express = require('express');
const cors = require('cors');

const { connectDB } = require('./db');
const restaurantsRoutes = require('./routes/restaurants.routes');

const app = express();
app.use(cors());
app.use(express.json());

// Healthcheck
app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'api', ts: Date.now() });
});

// Mount /restaurants
app.use('/restaurants', restaurantsRoutes);

// 404 para rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'not_found', path: req.originalUrl });
});

// Arranque del servidor tras conectar a la BD
const PORT = Number(process.env.PORT || 3000);
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`[API] running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('[DB] connection error:', err);
    process.exit(1);
  });

