const router = require('express').Router();
const { listRestaurants } = require('../controllers/restaurants.controller');

router.get('/restaurants', listRestaurants);

module.exports = router;
