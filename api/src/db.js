// Conexión simple a MongoDB usando el driver nativo
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME || 'restaurant_db';

let client;
let db;

/**
 * Conecta una sola vez y reutiliza la conexión.
 */
async function connectDB() {
  if (db) return db;
  client = new MongoClient(uri);
  await client.connect();
  db = client.db(dbName);
  console.log(`[DB] Connected to ${dbName}`);
  return db;
}

/**
 * Devuelve la instancia de DB (asegurando conexión previa).
 */
async function getDB() {
  if (!db) await connectDB();
  return db;
}

/**
 * Helper: devuelve la colección pedida (asegura conexión).
 * @param {string} name
 */
async function col(name) {
  const database = await getDB();
  return database.collection(name);
}

module.exports = { connectDB, getDB, col };

