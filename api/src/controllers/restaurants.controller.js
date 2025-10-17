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
