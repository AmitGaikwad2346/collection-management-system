# Collection Management System - Backend

## Overview
This is a **Node.js** and **Express**-based backend API for managing **collections** and **recommendations**. Users can create collections, add/remove recommendations, search, and manage authentication securely.

## Setup and Running Instructions

### 1. Prerequisites
Ensure you have the following installed:
- **Node.js** (v20+)
- **MongoDB** (Local or Atlas)
- **Docker** (if running in a container)

### 2. Clone Repository
```bash
git clone https://github.com/AmitGaikwad2346/collection-management-system.git
cd collection-management-system
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Setup Environment Variables
Create a `.env` file in the root directory and add the following:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/collectionDB
JWT_SECRET=zQDfWv0r68eBP1DFJv70MhOBPSeN1waC
ACCESS_TOKEN_EXPIRY=1h
```

### 5. Start the Server
```bash
npm run dev
```
or

```bash
npm run start
```

The API will be available at [http://localhost:5000](http://localhost:5000)

### 6. Run in Docker
To start the application using Docker:
```bash
docker-compose up --build
```

---
## API Documentation
### Swagger API Documentation

The API is documented using **Swagger**. You can access and test the API endpoints using the Swagger UI at:

[http://localhost:5000/api-docs](http://localhost:5000/api-docs)

> **Note:** Ensure the server is running before accessing the Swagger documentation.

### Authentication
| Method | Endpoint         | Description      | Payload |
|--------|-----------------|------------------|---------|
| **POST** | `/api/auth/signup` | Register a user | `{ fname, email, password }` |
| **POST** | `/api/auth/login` | Login & get token | `{ email, password }` |

> **📊 Headers:** All endpoints require `Authorization: Bearer <token>` after login.

### Collection Management
| Method | Endpoint           | Description | Payload |
|--------|-------------------|-------------|---------|
| **POST** | `/api/collection/` | Create a new collection | `{ name }` |
| **GET** | `/api/collection/` | Get all collections (with pagination) | `?page=1&limit=20` |
| **DELETE** | `/api/collection/:id` | Soft delete a collection | N/A |
| **PUT** | `/api/collection/:id` |Update name of collection | `{ name }` |
| **GET** | `/api/collection/:id` |View single collection   |  N/A |

### Recommendation Management
| Method | Endpoint           | Description | Payload |
|--------|-------------------|-------------|---------|
| **POST** | `/api/recommendation/` | Create new recommendation | `{ title, description }` |
| **POST** | `/api/recommendation/:collectionId` | Add a recommendation to a collection | `{ recommendationId }` |
| **DELETE** | `/api/recommendation/:collectionId` | Remove a recommendation from a collection | `{ recommendationId }` |
| **GET** | `/api/recommendation/` | Get all recommendations from a collection (paginated) | `?page=1&limit=20` |

---
## Assumptions and Design Decisions
1. Each **collection** is owned by a **single user**.
2. A **recommendation** can be added to **multiple collections** but only **once per collection**.
3. **Soft delete** is implemented to allow **data recovery**.
4. **Pagination** is added for **scalability** (default: 20 items per page).

---
## Author
Developed by **Amit Gaikwad** for an interview assessment.

