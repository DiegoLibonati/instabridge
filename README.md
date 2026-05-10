# Instabridge

## Educational Purpose

This project was created primarily for **educational and learning purposes**.  
While it is well-structured and could technically be used in production, it is **not intended for commercialization**.  
The main goal is to explore and demonstrate best practices, patterns, and technologies in software development.

## Description

**Instabridge** is a RESTful backend API built with Node.js, TypeScript, and Express that acts as a structured and efficient bridge between your application and the Instagram Graph API (`https://graph.instagram.com`).

The API handles the full authentication and data retrieval flow required to interact with Instagram's platform. It resolves a user's Instagram ID from a given access token, caches both the token and the user ID in Redis to avoid redundant calls to the Instagram API on every request, and exposes clean endpoints to retrieve profile information such as username, account type, and media count.

The caching layer built on Redis ensures that once the authentication flow is completed, subsequent requests are fast and do not repeatedly hit the external Instagram API. The session is persisted across requests using Redis as a key-value store, meaning the app maintains state without requiring a traditional database.

The project follows a layered architecture separating concerns into controllers, services, DAOs, middlewares, and configuration modules. Request validation is handled through middlewares that verify the presence of a valid access token and a resolved user ID before allowing access to protected endpoints. Error handling is centralized and consistent across the entire application.

It is fully containerized with Docker, includes separate environments for development (with hot-reload via nodemon), production (multi-stage build), and testing (isolated Redis instance). The test suite uses Jest with Supertest for integration testing against the real application stack.

## Technologies used

1. Node.js
2. Typescript
3. Express
4. Redis
5. Docker

## Libraries used

#### Dependencies

```
"express": "^4.21.0"
"morgan": "^1.10.1"
"redis": "^4.6.13"
```

#### devDependencies

```
"@eslint/js": "^9.0.0"
"@types/express": "^5.0.0"
"@types/jest": "^30.0.0"
"@types/morgan": "^1.9.10"
"@types/node": "^22.0.0"
"@types/supertest": "^6.0.2"
"eslint": "^9.0.0"
"eslint-config-prettier": "^9.0.0"
"eslint-plugin-prettier": "^5.0.0"
"globals": "^15.0.0"
"husky": "^9.0.0"
"jest": "^30.0.0"
"lint-staged": "^15.0.0"
"prettier": "^3.0.0"
"supertest": "^7.0.0"
"ts-jest": "^29.4.6"
"tsc-alias": "^1.8.16"
"tsx": "^4.0.0"
"typescript": "^5.5.3"
"typescript-eslint": "^8.0.0"
```

## Getting Started

> **Requirements:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) must be installed.

1. Clone the repository.
2. Navigate to the project folder.
3. Copy `.env.example` to `.env` and fill in the required values (see [Env Keys](#env-keys) for a full reference and [Instagram Credentials](#instagram-credentials) for how to obtain the Meta-issued secrets).
4. Build the Docker images: `docker-compose -f dev.docker-compose.yml build --no-cache`
5. Start the containers: `docker-compose -f dev.docker-compose.yml up --force-recreate`

The API will be available at `http://localhost:5050`.

## Env Keys

The application reads the following variables from your `.env` at startup:

| Key                           | Description                                                                       |
| ----------------------------- | --------------------------------------------------------------------------------- |
| `PORT`                        | Port the HTTP server listens on (default: `5050`).                                |
| `API_VERSION`                 | Current API version returned in responses.                                        |
| `NODE_ENV`                    | Runtime environment (`development`, `production`, `test`).                        |
| `BASE_URL`                    | Base URL of the deployed API (optional, used in production).                      |
| `INSTAGRAM_API`               | Base URL for the Instagram Graph API.                                             |
| `INSTAGRAM_API_VERSION`       | Instagram Graph API version (e.g. `v19.0`).                                       |
| `INSTAGRAM_SECRET_CLIENT`     | Instagram app secret obtained from Meta Developer Portal.                         |
| `INSTAGRAM_USER_ACCESS_TOKEN` | User access token generated from your Instagram app. See steps below.             |
| `REDIS_HOST`                  | Redis host (`redis` when using Docker Compose, `host.docker.internal` otherwise). |
| `REDIS_PORT`                  | Redis port (default: `6379`).                                                     |
| `CHOKIDAR_USEPOLLING`         | Enable polling-based file watching for hot-reload in Docker on Windows.           |
| `CHOKIDAR_INTERVAL`           | Polling interval in milliseconds (default: `100`).                                |

```bash
PORT="5050"
API_VERSION="0.0.1"
NODE_ENV=development
BASE_URL=

INSTAGRAM_API="https://graph.instagram.com"
INSTAGRAM_API_VERSION="v19.0"
INSTAGRAM_SECRET_CLIENT="YOUR_SECRET_CLIENT"
INSTAGRAM_USER_ACCESS_TOKEN="YOUR_ACCESS_TOKEN"

REDIS_HOST="redis"
REDIS_PORT="6379"

CHOKIDAR_USEPOLLING=true
CHOKIDAR_INTERVAL=100
```

## Instagram Credentials

The two Meta-issued values above (`INSTAGRAM_SECRET_CLIENT` and `INSTAGRAM_USER_ACCESS_TOKEN`) require creating an app in the Meta Developer Portal. The steps below walk through that process.

### How to obtain `INSTAGRAM_SECRET_CLIENT` and `INSTAGRAM_USER_ACCESS_TOKEN`

#### 1. Create a Meta App

1. Go to [Meta for Developers](https://developers.facebook.com) and log in.
2. Click **My Apps → Create App**.
3. Select **Other** as the use case, then choose **Business** as the app type.
4. Fill in the app name and contact email, then click **Create App**.

#### 2. Add the Instagram Product

1. In your app dashboard, scroll down to **Add Products to Your App**.
2. Find **Instagram** and click **Set Up**.

#### 3. Get the App Secret (`INSTAGRAM_SECRET_CLIENT`)

1. Go to **App Settings → Basic**.
2. Click **Show** next to **App Secret** and copy the value.
3. Set it as `INSTAGRAM_SECRET_CLIENT` in your `.env`.

#### 4. Add a Test User and generate the Access Token (`INSTAGRAM_USER_ACCESS_TOKEN`)

1. In the left sidebar, go to **Instagram → API Setup with Instagram Login** (or **Basic Display**).
2. Scroll to **User Token Generator** and click **Add or Remove Instagram Testers**.
3. Invite your Instagram account as a tester.
4. Accept the invitation from your Instagram account: go to **Settings → Apps and Websites → Tester Invites**.
5. Back in the developer dashboard under **User Token Generator**, click **Generate Token** next to your account.
6. Authorize the app and copy the generated token.
7. Set it as `INSTAGRAM_USER_ACCESS_TOKEN` in your `.env`.

> **Note:** User access tokens expire. If the API starts returning 400 errors, generate a new token and update your `.env`. You will also need to run `docker exec -it <redis-container> redis-cli FLUSHALL` so the new token replaces the cached one.

## Endpoints

With the environment configured and the containers running, the server exposes the following routes.

The required call order is: **auth first, then instagram routes**. The auth endpoint resolves and caches the user ID in Redis. Instagram endpoints require both a valid access token and a cached user ID to work.

### Health

| Method | Route     | Auth required |
| ------ | --------- | ------------- |
| GET    | `/health` | No            |

Returns `{ "status": "ok" }`. Used to verify the server is running.

---

### Auth

| Method | Route                  | Auth required |
| ------ | ---------------------- | ------------- |
| GET    | `/api/v1/auth/user_id` | Access token  |

Resolves the Instagram user ID from the configured access token and caches it in Redis. **Must be called once before using any Instagram endpoint.**

---

### Instagram

| Method | Route                            | Auth required          |
| ------ | -------------------------------- | ---------------------- |
| GET    | `/api/v1/instagram/alive`        | Access token + user ID |
| GET    | `/api/v1/instagram/user/profile` | Access token + user ID |

**`GET /api/v1/instagram/alive`**
Returns API metadata (author, version).

**`GET /api/v1/instagram/user/profile`**
Returns the Instagram profile of the authenticated user: `id`, `username`, `account_type`, `media_count`.

## Testing

The test suite exercises the endpoints above end-to-end against a real (isolated) Redis instance using Jest and Supertest.

1. Navigate to the project folder
2. Execute: `npm test`

For coverage report:

```bash
npm run test:coverage
```

## Security Audit

Beyond runtime tests, dependencies should be audited regularly for known vulnerabilities.

### npm audit

Check for vulnerabilities in dependencies:

```bash
npm audit
```

Fix vulnerabilities automatically (when a safe upgrade exists):

```bash
npm audit fix
```

## Known Issues

None at the moment.

## Portfolio link

[https://diegolibonati.com.ar/#/project/instabridge](https://diegolibonati.com.ar/#/project/instabridge)
