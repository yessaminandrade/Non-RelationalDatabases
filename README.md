# Non-RelationalDatabases
## Restaurant Directory Platform (MongoDB + Express.js)

A three-sprint project to transform a restaurant directory into a personalized, dynamic experience using MongoDB for JSON document storage and an Express.js RESTful API.

## Project Goals:

- Store unstructured restaurant data in non-relational (MongoDB) collections.

- Build and evolve a RESTful API with Express.js to expose this data.

- Demonstrate end-to-end functionality with Postman/Insomnia tests and a final PDF + MP4 presentation.

## Deliverables by Sprint:

### Sprint 1 (this repo state):
- Database setup in MongoDB, GitHub repository with basic structure, database backup (collections + indexes), CSV import scripts, and screenshots as evidence.

### Sprint 2:
- RESTful API using Express.js + MongoDB, tested with Postman/Insomnia, pushed to GitHub.

### Sprint 3:
- New API features (search/filtering), tests in Postman/Insomnia showing these capabilities.

## Final Submission:
Integrated deliverables from Sprints 1–3, plus analysis/results (PDF) and a video presentation (MP4).

## Tech Stack:

- Database: MongoDB Community Server + MongoDB Compass + mongosh

- API (Sprint 2+): Node.js, Express.js

- Tools: Git/GitHub, Postman or Insomnia (for API tests)

## Repository Structure:
.
├─ db/
│  ├─ seeds/                # CSV source files to import (e.g., restaurants.csv, categories.csv, reviews.csv)
│  └─ backup/               # MongoDB dumps (BSON/JSON) produced by mongodump
├─ docs/
│  └─ screenshots/          # Evidence images (Compass: DB, collections, indexes; console outputs)
├─ scripts/
│  ├─ create_db.js          # Creates DB, collections, and indexes (idempotent)
│  ├─ import_data.bat       # Windows CSV import script (mongoimport)
│  └─ import_data.sh        # macOS/Linux CSV import script (mongoimport)
├─ src/                     # (Sprint 2+) Express.js API source code
├─ .env.example             # (Sprint 2+) Environment variables template
└─ README.md

## Versioning Guidelines (X.Y.Z):

- X (Major) – Breaking changes.

- Y (Features) – New functionality.

- Z (Fixes) – Bug fixes/minor corrections.
