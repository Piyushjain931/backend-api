# Basic Website Backend

A small REST API built with Node.js, Express, and MongoDB/Mongoose. It includes account registration and login, password hashing, JWT authentication, logout, and authenticated CRUD operations for posts.

## Requirements

- Node.js 18 or newer and npm
- A MongoDB Atlas cluster or local MongoDB instance
- Postman (optional, for sending the included API requests)

## Run locally

1. In this folder, install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in `MONGODB_URI`. In MongoDB Atlas, create a database user and allow your development IP address in Network Access. Keep the URI private. Replace `JWT_SECRET` with a random secret of at least 32 characters.

3. Start the server:

   ```bash
   npm run dev
   ```

   The API listens on `http://localhost:8000` by default. Check `GET /api/v1/health` for `{ "status": "ok" }`.

## API routes

All request bodies use JSON (`Content-Type: application/json`). A successful registration or login returns a JWT. For protected routes, send `Authorization: Bearer <token>`.

| Method | Route | Auth | Purpose |
| --- | --- | --- | --- |
| POST | `/api/v1/users/register` | No | Create an account (`username`, `email`, `password`) |
| POST | `/api/v1/users/login` | No | Log in (`email`, `password`) |
| POST | `/api/v1/users/logout` | Yes | Invalidate the current token |
| POST | `/api/v1/posts` | Yes | Create a post (`name`, `description`, `age`) |
| GET | `/api/v1/posts` | Yes | List your posts |
| GET | `/api/v1/posts/:id` | Yes | Read one of your posts |
| PATCH | `/api/v1/posts/:id` | Yes | Update one or more post fields |
| DELETE | `/api/v1/posts/:id` | Yes | Delete one of your posts |

Posts belong to the signed-in user. Users cannot read, change, or delete another user's posts. A post age must be a number from 0 to 150. Passwords must contain at least 8 characters.

## Postman

Import `postman/Backend API.postman_collection.json` into Postman. The collection has example requests and saves the returned token and post ID into collection variables as you use it. Register or log in first, then create a post and try listing, reading, updating, and deleting it. After logout, the saved token is invalid; log in again before continuing.

## Project structure

```text
src/
  config/       MongoDB connection
  controllers/  Request handling and API logic
  middleware/   JWT authentication
  models/       Mongoose User and Post schemas
  routes/       API route definitions
  app.js        Express app, routes, and error handling
  index.js      Environment setup, database connection, server start
postman/        Importable API collection
```

## Publish to a separate public GitHub repository

Create a new empty public repository on GitHub, then from this `backend` folder run:

```bash
git init
git add .
git commit -m "Build basic Node Express MongoDB backend"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

Do not add `.env` or share database credentials. The `.gitignore` excludes `.env` and `node_modules`. The assignment requires submitting the resulting public repository URL and demonstrating the running app; those steps require your GitHub account and your MongoDB connection details.
