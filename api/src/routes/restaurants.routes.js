// Rutas de restaurantes
const express = require('express');
const router = express.Router();

const { listRestaurants } = require('../controllers/restaurants.controller');
const { validateSearch } = require('../validators/restaurants.search.schema');

// Endpoint de búsqueda
router.get('/search', validateSearch, listRestaurants);

module.exports = router;

