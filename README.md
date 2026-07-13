# backend-auth

A RESTful backend API built with **Node.js**, **Express**, and **MongoDB Atlas**. Features JWT-based authentication and role-based access control (RBAC) for managing users and tasks.

---

## Features

- User registration & login with hashed passwords
- JWT authentication (Bearer token)
- Role-based authorization — `Admin`, `Manager`, `User`
- Full CRUD for tasks with assignment tracking
- Mongoose models with timestamps and population
- Environment-based configuration via `.env`

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB Atlas (Mongoose ODM) |
| Auth | JSON Web Tokens (JWT) |
| Password Hashing | bcryptjs |
| Config | dotenv |

---

## Project Structure

```
backend/
├── app.js                  # Express app setup & route mounting
├── server.js               # Entry point — DB connection & server start
├── config/
│   ├── db.js               # Mongoose connection logic
│   └── roles.json          # Role definitions
├── controllers/
│   ├── authController.js   # Register & login logic
│   └── taskController.js   # Task CRUD logic
├── middleware/
│   ├── authMiddleware.js   # JWT verification (protect)
│   └── roleMiddleware.js   # Role-based authorization (authorize)
├── models/
│   ├── User.js             # User schema
│   └── Task.js             # Task schema
└── routes/
    ├── authRoutes.js       # /api/auth routes
    └── taskRoutes.js       # /api/tasks routes
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- A [MongoDB Atlas](https://cloud.mongodb.com) cluster

### Installation

```bash
git clone https://github.com/abs004/backend-auth.git
cd backend-auth/backend
npm install
```

### Environment Variables

Create a `.env` file in the `backend/` directory:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?appName=Cluster0
JWT_SECRET=your_super_secret_key
PORT=3000
```

### Run the Server

```bash
node server.js
```

Server starts at `http://localhost:3000`.

---

## API Reference

### Auth Routes — `/api/auth`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a new user |
| `POST` | `/api/auth/login` | Public | Login and receive a JWT |

#### POST `/api/auth/register`

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123",
  "role": "User"
}
```

> `role` must be one of: `Admin`, `Manager`, `User` (defaults to `User`)

**Response `201`:**
```json
{
  "message": "User registered successfully",
  "user": { "_id": "...", "name": "John Doe", "email": "john@example.com", "role": "User" }
}
```

---

#### POST `/api/auth/login`

```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

**Response `200`:**
```json
{
  "message": "User logged in successfully",
  "token": "<jwt_token>",
  "user": { "_id": "...", "name": "John Doe", "email": "john@example.com", "role": "User" }
}
```

---

### Task Routes — `/api/tasks`

All task routes require the `Authorization: Bearer <token>` header.

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/tasks` | Admin, Manager | Create a new task |
| `GET` | `/api/tasks` | All authenticated | Get all tasks |
| `GET` | `/api/tasks/:id` | All authenticated | Get a single task |
| `PUT` | `/api/tasks/:id` | All authenticated | Update a task |
| `DELETE` | `/api/tasks/:id` | Admin, Manager | Delete a task |

#### POST `/api/tasks`

```json
{
  "title": "Fix login bug",
  "description": "Users can't login with special chars in password",
  "priority": "High",
  "dueDate": "2026-08-01",
  "assignedTo": "<user_id>"
}
```

> `priority`: `Low` | `Medium` | `High` (default: `Medium`)  
> `status`: `Pending` | `In Progress` | `Completed` (default: `Pending`)

---

## Data Models

### User

| Field | Type | Notes |
|---|---|---|
| `name` | String | Required |
| `email` | String | Required, unique, lowercase |
| `password` | String | Required, bcrypt hashed |
| `role` | String | `Admin` \| `Manager` \| `User` |
| `createdAt` | Date | Auto (timestamps) |
| `updatedAt` | Date | Auto (timestamps) |

### Task

| Field | Type | Notes |
|---|---|---|
| `title` | String | Required |
| `description` | String | Optional |
| `status` | String | `Pending` \| `In Progress` \| `Completed` |
| `priority` | String | `Low` \| `Medium` \| `High` |
| `dueDate` | Date | Optional |
| `assignedTo` | ObjectId → User | Required |
| `assignedBy` | ObjectId → User | Auto (from JWT) |
| `createdBy` | ObjectId → User | Auto (from JWT) |
| `createdAt` | Date | Auto (timestamps) |
| `updatedAt` | Date | Auto (timestamps) |

---

## Authentication Flow

```
1. Register  →  POST /api/auth/register
2. Login     →  POST /api/auth/login  →  receive JWT token
3. Use token →  Authorization: Bearer <token>  on protected routes
```

---

## Role Permissions

| Action | User | Manager | Admin |
|---|:---:|:---:|:---:|
| Register / Login | ✅ | ✅ | ✅ |
| View tasks | ✅ | ✅ | ✅ |
| Update tasks | ✅ | ✅ | ✅ |
| Create tasks | ❌ | ✅ | ✅ |
| Delete tasks | ❌ | ✅ | ✅ |

---

## License

ISC
