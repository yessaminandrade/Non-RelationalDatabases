require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { connect } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ ok: true, service: 'api', ts: Date.now() });
});

// Rutas
const restaurantsRoutes = require('./routes/restaurants.routes');
app.use('/api', restaurantsRoutes);

const PORT = process.env.PORT || 3000;

connect()
  .then(() => {
    app.listen(PORT, () => console.log(`[API] running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('[DB] connection error:', err);
    process.exit(1);
  });
