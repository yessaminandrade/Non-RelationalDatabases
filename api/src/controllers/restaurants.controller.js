// Controlador de restaurantes: búsqueda con filtros y paginación
const { col } = require('../db');

/**
 * GET /restaurants/search
 * Query soportadas:
 *  - q (busca en name y tags)
 *  - city
 *  - cuisine (string o array)
 *  - min_rating (0..5)
 *  - max_price  (1..5)
 *  - sort: rating | -rating | price | -price | name | -name | created_at | -created_at
 *  - page (>=1)
 *  - limit (1..50)
 */
async function listRestaurants(req, res) {
  const q = req.validated || req.query;

  // Construcción del filtro Mongo
  const filter = {};

  if (q.q) {
    filter.$or = [
      { name: { $regex: q.q, $options: 'i' } },
      { tags: { $elemMatch: { $regex: q.q, $options: 'i' } } }
    ];
  }

  if (q.city) filter.city = q.city;

  if (q.cuisine) {
    // si es un string, buscamos coincidencia; si es array, al menos uno
    filter.cuisine = Array.isArray(q.cuisine)
      ? { $in: q.cuisine }
      : q.cuisine;
  }

  if (q.min_rating !== undefined) {
    filter.avg_rating = { ...(filter.avg_rating || {}), $gte: q.min_rating };
  }

  if (q.max_price !== undefined) {
    filter.price_level = { ...(filter.price_level || {}), $lte: q.max_price };
  }

  // Orden
  const sortMap = {
    rating: 'avg_rating',
    price: 'price_level',
    name: 'name',
    created_at: 'created_at'
  };
  let sort = {};
  if (q.sort) {
    const desc = q.sort.startsWith('-');
    const key = q.sort.replace(/^-/, '');
    const field = sortMap[key];
    if (field) sort[field] = desc ? -1 : 1;
  }

  const page = q.page || 1;
  const limit = q.limit || 10;
  const skip = (page - 1) * limit;

  const restaurantsCol = await col('restaurants');

  const [total, data] = await Promise.all([
    restaurantsCol.countDocuments(filter),
    restaurantsCol
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray()
  ]);

  res.json({
    ok: true,
    page,
    limit,
    total,
    count: data.length,
    data
  });
}

module.exports = { listRestaurants };

