// Validador de query con Joi para /restaurants/search
const Joi = require('joi');

// Permite string o array; si viene "a,b,c" lo parte a array.
function toArray(val) {
  if (val === undefined) return undefined;
  if (Array.isArray(val)) return val;
  if (typeof val === 'string' && val.includes(',')) {
    return val.split(',').map(s => s.trim()).filter(Boolean);
  }
  return val;
}

const schema = Joi.object({
  q: Joi.string().trim().min(1).optional(),
  city: Joi.string().trim().min(1).optional(),
  // puede llegar como string o array repetida (?cuisine=japanese&cuisine=peruvian)
  cuisine: Joi.alternatives().try(
    Joi.string().trim().min(1),
    Joi.array().items(Joi.string().trim().min(1)).min(1)
  ).optional(),
  min_rating: Joi.number().min(0).max(5).optional(),
  max_price: Joi.number().integer().min(1).max(5).optional(),
  sort: Joi.string()
    // ejemplos válidos: "rating", "-rating", "price", "-price", "name", "-name", "created_at", "-created_at"
    .pattern(/^(-?)(rating|price|name|created_at)$/)
    .optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(10)
}).custom((obj, helpers) => {
  // normaliza cuisine
  if (obj.cuisine !== undefined) {
    obj.cuisine = toArray(obj.cuisine);
  }
  return obj;
}, 'normalize');

function validateSearch(req, res, next) {
  const { error, value } = schema.validate(req.query, {
    abortEarly: false,
    stripUnknown: true,
    convert: true
  });

  if (error) {
    return res.status(422).json({
      error: 'validation_error',
      details: error.details.map(d => d.message)
    });
  }

  req.validated = value;
  next();
}

module.exports = { schema, validateSearch };

