const router = require('express').Router();
const { listRestaurants } = require('../controllers/restaurants.controller');

router.get('/restaurants', listRestaurants);

module.exports = router;

const { Router } = require('express');
const { listRestaurants } = require('../controllers/restaurants.controller');
const { validateSearch } = require('../validators/restaurants.search.schema');

router.get('/restaurants/search', validateSearch, listRestaurants);

