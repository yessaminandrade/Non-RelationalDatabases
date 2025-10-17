const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'restaurant_db';

const client = new MongoClient(uri, { ignoreUndefined: true });

let db;
async function connect() {
  if (!db) {
    await client.connect();
    db = client.db(DB_NAME);
    console.log('[DB] Connected to', DB_NAME);
  }
  return db;
}

module.exports = { connect, client };
