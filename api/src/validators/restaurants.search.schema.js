const Joi = require('joi');

// Convierte "a,b,c" -> ["a","b","c"]
function csvToArray(v) {
  if (Array.isArray(v)) return v;
  if (typeof v === 'string')
    return v.split(',').map(s => s.trim()).filter(Boolean);
  return v;
}

const schema = Joi.object({
  q: Joi.string().trim().min(1),                 // texto libre
  city: Joi.string().trim(),                     // ciudad exacta
  cuisine: Joi.alternatives()                    // "it,peru" ó ["it","peru"]
    .try(
      Joi.string().custom(csvToArray),
      Joi.array().items(Joi.string().trim())
    )
    .custom(csvToArray),
  min_rating: Joi.number().min(0).max(5),
  max_price: Joi.number().integer().min(1).max(5),
  sort: Joi.string()
    .valid('rating', '-rating', 'price', '-price', 'name', '-name', 'created_at', '-created_at')
    .default('-created_at'),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(10)
}).unknown(false); // rechaza params no definidos

function validateSearch(req, res, next) {
  const result = schema.validate(req.query, { abortEarly: false, convert: true });
  if (result.error) {
    return res.status(400).json({
      error: 'validation_error',
      details: result.error.details.map(d => d.message)
    });
  }
  // Parametros validados y normalizados
  req.search = result.value;
  return next();
}

module.exports = { schema, validateSearch };
