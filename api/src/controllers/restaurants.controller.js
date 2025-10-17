const { connect } = require('../db');

async function listRestaurants(req, res) {
  try {
    const db = await connect();
    const data = await db.collection('restaurants')
      .find({})
      .limit(10)
      .toArray();

    res.json({ count: data.length, data });
  } catch (err) {
    console.error('[restaurants] list error:', err);
    res.status(500).json({ error: 'internal_error' });
  }
}

module.exports = { listRestaurants };

async function searchRestaurants(req, res) {
  try {
    const db = req.app.get('db');              // tomado de src/db.js / index.js
    const col = db.collection('restaurants');

    // Lo que Joi dejó listo:
    const { q, city, cuisine, min_rating, max_price, sort, page, limit } = req.search;

    // Construye un filtro básico (lo puedes enriquecer en el paso 3.2)
    const filter = {};
    if (q) {
      filter.name = { $regex: q, $options: 'i' }; // búsqueda por nombre
    }
    if (city) filter.city = city;
    if (cuisine?.length) filter.cuisine = { $all: cuisine }; // si guardas cuisine como array
    if (typeof min_rating === 'number') filter.avg_rating = { ...(filter.avg_rating || {}), $gte: min_rating };
    if (typeof max_price === 'number') filter.price_level = { $lte: max_price };

    // Sort mapping
    const sortMap = {
      rating: { avg_rating: 1 }, '-rating': { avg_rating: -1 },
      price: { price_level: 1 }, '-price': { price_level: -1 },
      name: { name: 1 }, '-name': { name: -1 },
      created_at: { created_at: 1 }, '-created_at': { created_at: -1 }
    };
    const sortStage = sortMap[sort] || { created_at: -1 };

    const skip = (page - 1) * limit;

    const cursor = col.find(filter).sort(sortStage).skip(skip).limit(limit);
    const [data, total] = await Promise.all([
      cursor.toArray(),
      col.countDocuments(filter)
    ]);

    res.json({
      ok: true,
      pagination: {
        page, limit,
        total,
        pages: Math.ceil(total / limit)
      },
      data
    });
  } catch (err) {
    console.error('searchRestaurants error:', err);
    res.status(500).json({ ok: false, error: 'internal_error' });
  }
}

module.exports = { listRestaurants, searchRestaurants };
