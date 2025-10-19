# Non-RelationalDatabases

---

# Restaurant Directory – Non-Relational Databases (MongoDB + Express)

A 3-sprint project to build a **restaurant directory** backed by **MongoDB** with a **Node.js/Express** REST API.
Users can search restaurants with free text, filter by city/cuisine/rating/price, paginate, and sort results.
All artifacts (DB backup, indexes, scripts, Postman collection, and screenshots) are included.

---

## Table of contents

* [Architecture & Stack](#architecture--stack)
* [Repository Structure](#repository-structure)
* [Quick Start](#quick-start)
* [Environment Variables](#environment-variables)
* [Database: seed, backup & indexes](#database-seed-backup--indexes)
* [Run the API](#run-the-api)
* [API Reference](#api-reference)
* [Validation Rules (422)](#validation-rules-422)
* [Postman Collection & Evidence](#postman-collection--evidence)
* [Sprint Deliverables](#sprint-deliverables)
* [Versioning](#versioning)
* [Contributing](#contributing)
* [License](#license)

---

## Architecture & Stack

* **Database:** MongoDB (document model, JSON)
* **API:** Node.js + Express
* **Validation:** Joi
* **Dev Tools:** nodemon, Postman
* **GUI:** MongoDB Compass (optional)

---

## Repository Structure

```
Non-RelationalDatabases/
├─ db/
│  └─ backup/                      # Sprint 1 export (JSON arrays)
│     ├─ restaurant_db.users.json
│     ├─ restaurant_db.restaurants.json
│     ├─ restaurant_db.reviews.json
│     └─ restaurant_db.favorites.json
├─ api/
│  ├─ src/
│  │  ├─ index.js                  # Express app bootstrap + routes
│  │  ├─ db.js                     # MongoDB connection helper
│  │  ├─ routes/
│  │  │  └─ restaurants.routes.js  # /health and /restaurants/search
│  │  ├─ controllers/
│  │  │  └─ restaurants.controller.js
│  │  └─ validators/
│  │     └─ restaurants.search.schema.js
│  ├─ docs/
│  │  ├─ Sprint3-RestaurantsApi.postman_collection.json
│  │  ├─ s3_01_health.png          # Evidence screenshots
│  │  ├─ s3_02_search_q.png
│  │  ├─ s3_03_filters_sort.png
│  │  ├─ s3_04_pagination.png
│  │  ├─ s3_05_validation_page.png
│  │  └─ s3_06_validation_sort.png
│  ├─ .env                         # local only (not committed)
│  ├─ .env.example
│  ├─ package.json
│  └─ README.md (optional)
└─ README.md (this file)
```

---

## Quick Start

1. **Install software**

* Node.js 18+
* MongoDB Community Server (includes `mongod`)
* (Optional) MongoDB Compass
* Postman

2. **Clone & install**

```bash
git clone <this-repo>
cd Non-RelationalDatabases/api
npm install
```

3. **Set environment**

```bash
cp .env.example .env
# Edit .env as needed (see next section)
```

4. **Restore sample DB (optional, for testing)**
   See [Database: seed, backup & indexes](#database-seed-backup--indexes).

5. **Run API**

```bash
npm run dev    # nodemon
# or
npm start
```

6. **Health check**
   Open [http://localhost:3000/health](http://localhost:3000/health)

---

## Environment Variables

Create a `.env` file (or reuse the one you already created):

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017
DB_NAME=restaurant_db
```

> Do **not** commit real secrets. A safe template is provided in `.env.example`.

---

## Database: seed, backup & indexes

### A) Restore the sample database (from Sprint 1 exports)

From the project **root** (or change the paths accordingly):

```bash
# Optional: clean DB to ensure a fresh import
mongosh --eval "db.getSiblingDB('restaurant_db').dropDatabase()"

# Import each collection (arrays of docs)
mongoimport --db restaurant_db --collection users        --file db/backup/restaurant_db.users.json        --jsonArray
mongoimport --db restaurant_db --collection restaurants  --file db/backup/restaurant_db.restaurants.json  --jsonArray
mongoimport --db restaurant_db --collection reviews      --file db/backup/restaurant_db.reviews.json      --jsonArray
mongoimport --db restaurant_db --collection favorites    --file db/backup/restaurant_db.favorites.json    --jsonArray

# Quick counts
mongosh --eval "use('restaurant_db'); print('users:', db.users.countDocuments()); print('restaurants:', db.restaurants.countDocuments()); print('reviews:', db.reviews.countDocuments()); print('favorites:', db.favorites.countDocuments());"
```

### B) Create the minimum indexes (Sprint 1 requirement)

Open **mongosh**:

```javascript
use('restaurant_db')

// restaurants
db.restaurants.createIndex({ city: 1 })
db.restaurants.createIndex({ cuisine: 1 })             // multikey (array)
db.restaurants.createIndex({ name: 1 }, { unique: true })

// users
db.users.createIndex({ email: 1 }, { unique: true })

// reviews
db.reviews.createIndex({ restaurant_id: 1 })
db.reviews.createIndex({ user_id: 1 })
db.reviews.createIndex({ restaurant_id: 1, user_id: 1 }, { unique: true }) // avoid duplicate reviews/user/restaurant

// favorites (optional)
db.favorites.createIndex({ user_id: 1, restaurant_id: 1 }, { unique: true })
```

---

## Run the API

```bash
cd api
npm run dev    # watches changes
# or
npm start
```

The server binds to `PORT` (default **3000**).
It connects to `DB_NAME` on `MONGODB_URI`.

---

## API Reference

### Health

```
GET /health
```

**200**:

```json
{ "ok": true, "service": "api", "ts": 1760... }
```

### Search restaurants

```
GET /restaurants/search
```

#### Query parameters

* **q** *(string, optional)* – free text over name/cuisine/address/etc.
* **city** *(string, optional)*
* **cuisine** *(string | string[], optional)* – can be repeated, e.g. `?cuisine=japanese&cuisine=peruvian`
* **min_rating** *(number, 0..5, optional)*
* **max_price** *(integer, 1..5, optional)*
* **sort** *(string, optional)* – one of:
  `rating | -rating | price | -price | name | -name | created_at`
* **page** *(integer, >=1, default 1)*
* **limit** *(integer, 1..50, default 10)*

#### Response (200)

```json
{
  "page": 1,
  "limit": 5,
  "total": 37,
  "data": [
    {
      "_id": "68f...de8",
      "name": "Sushi Go",
      "city": "Lima",
      "address": "Calle Alcanfores 456",
      "cuisine": ["japanese", "fusion"],
      "price_level": 3,
      "avg_rating": 4.6,
      "created_at": "2025-01-02T00:00:00.000Z"
    }
  ]
}
```

#### Examples

* Free text + pagination:

```
GET /restaurants/search?q=sushi&page=1&limit=5
```

* Filter and sort by rating desc:

```
GET /restaurants/search?city=Lima&sort=-rating&limit=3
```

* Multi-cuisine + max price:

```
GET /restaurants/search?cuisine=japanese&cuisine=peruvian&max_price=3
```

---

## Validation Rules (422)

Requests are validated with **Joi** (`src/validators/restaurants.search.schema.js`).
If validation fails, API returns **422** with details, e.g.:

```json
{
  "error": "validation_error",
  "details": [
    "\"page\" must be greater than or equal to 1"
  ]
}
```

Common invalid examples:

* `page=-1` → 422
* `limit=0` or `limit=999` → 422
* `sort=-unknown` → 422

---

## Postman Collection & Evidence

* **Collection**: `api/docs/Sprint3-RestaurantsApi.postman_collection.json`
  Import it in Postman (**Import → File**) and run the saved requests:

  * *Health*
  * *Search – q/page/limit*
  * *FreeText*
  * *City*
  * *Cuisine*
  * *min_rating*
  * *max_price*
  * *asc / desc (sort)*
  * *422 (invalid page)*
  * *invalid (unknown sort)*

* **Screenshots**: `api/docs/s3_*.png` (evidence for Sprint 3)

---

## Sprint Deliverables

### Sprint 1 – Database setup

* MongoDB database `restaurant_db` created with **users**, **restaurants**, **reviews**, **favorites**.
* **Export/backup** JSON files in `db/backup/`.
* Minimum **indexes** created (see section above).
* Screenshots of Compass/collections (optional).
* README updated with steps.

### Sprint 2 – Base REST API

* Node.js/Express project in `/api`.
* Endpoints:

  * `GET /health`
  * (Scaffold of restaurants module)
* Project structure, **.env**, and run scripts (`npm start`, `npm run dev`).
* Initial Postman tests.

### Sprint 3 – Search & Filtering

* `GET /restaurants/search` with **free text**, **filters** (city, cuisine[], min_rating, max_price), **pagination**, and **sorting**.
* **Validation** with Joi and consistent **422** errors.
* **Postman collection** + **screenshots** in `api/docs/`.
* Branch merged to `main` and optional tag `v0.3.0`.

---

## Versioning

* Example tags:

  * `v0.1.0` – Sprint 1
  * `v0.2.0` – Sprint 2
  * `v0.3.0` – Sprint 3
* Semantic versioning for major/minor/fix.

---

## Contributing

1. Create a feature branch: `feat/<short-name>`
2. Commit with clear messages (e.g., `feat(search): add sort by rating`)
3. Open a PR to `main` and attach screenshots/evidence if applicable.

---

## License

MIT. See `LICENSE` (or add one if not present).

---

### Tips

* If you get **ECONNREFUSED** in Postman, confirm the API is running on `PORT` and that `.env` points to a reachable MongoDB.
* On Windows, if you see `LF will be replaced by CRLF` warnings during `git add`, it’s harmless.
