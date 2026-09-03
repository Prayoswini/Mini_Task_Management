# Mini Task Management System - Backend API

Production-ready Node.js & Express REST API with MongoDB/Mongoose, JWT Authentication, Role-Based Authorization (Admin/User), and clean **MVC Architecture**.

---

## 🚀 Technologies Used

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (MongoDB Atlas cloud cluster) with Mongoose ODM (Object Document Modelling)
- **Authentication**: JSON Web Tokens (JWT)
- **Security & Hashing**: bcryptjs password hashing
- **Middleware**: CORS, Custom Auth & Role Middlewares, Central Error Handling

---

## 📁 MVC Architecture Directory Structure

```
backend/
├── config/
│   └── db.js                 # MongoDB Mongoose connection setup
├── models/
│   ├── User.js               # User Schema (name, email, password hash, role)
│   └── Task.js               # Task Schema (title, description, status, priority, dueDate, createdBy)
├── middleware/
│   ├── auth.middleware.js    # JWT verification & req.user attachment
│   ├── role.middleware.js    # Role authorization (Admin vs User access control)
│   └── error.middleware.js   # Global error handling and 404 handler
├── controllers/
│   ├── auth.controller.js    # Logic for login, current profile
│   ├── task.controller.js    # Task CRUD, filtering, search, and ownership checks
│   └── admin.controller.js   # Admin user management, system tasks, stats
├── routes/
│   ├── auth.routes.js        # Auth API endpoints (/api/auth)
│   ├── task.routes.js        # Task API endpoints (/api/tasks)
│   └── admin.routes.js       # Admin API endpoints (/api/admin)
├── .env                      # Local environment configuration
├── .env.example              # Template environment file
├── seed.js                   # Seeding script for sample users and tasks
├── server.js                 # Express application entrypoint
└── package.json              # Dependencies and scripts
```

---

## ⚙️ Environment Variables Setup

Create a `.env` file in the root of the `backend/` directory (or edit the created `.env` file):

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database_name>?retryWrites=true&w=majority
JWT_SECRET=supersecret_jwt_key_mini_task_app_2026_safe
JWT_EXPIRE=30d
```

> **Note for MongoDB Atlas:** Replace `<username>`, `<password>`, `<cluster>`, and `<database_name>` with your actual MongoDB Atlas connection details.

---

## 📦 Installation & Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Seed Initial Database Data (Admin & Demo Users)**:
   ```bash
   npm run seed
   ```
   *Creates default accounts:*
   - **Admin Account**: Email: `admin@example.com` | Password: `password123`
   - **User Account**: Email: `user@example.com` | Password: `password123`

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

4. **Start Production Server**:
   ```bash
   npm start
   ```

---

## 🔑 API Endpoints Reference

### 🔐 Authentication APIs (`/api/auth`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT token + user role |
| `GET` | `/api/auth/me` | Private | Get logged-in user profile |

#### Login Request Payload Example (`POST /api/auth/login`):
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

---

### 📋 Task APIs (`/api/tasks`)

> **Headers Required**: `Authorization: Bearer <JWT_TOKEN>`

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/tasks` | Private (User/Admin) | Get tasks (Supports `?search=`, `?status=`, `?priority=`) |
| `GET` | `/api/tasks/:id` | Private (Owner/Admin) | Get single task details by ID |
| `POST` | `/api/tasks` | Private (User/Admin) | Create a new task |
| `PUT` | `/api/tasks/:id` | Private (Owner/Admin) | Update an existing task |
| `DELETE` | `/api/tasks/:id` | Private (Owner/Admin) | Delete a task |

#### Create Task Payload Example (`POST /api/tasks`):
```json
{
  "title": "Design Landing Page",
  "description": "Create high fidelity wireframes and user flow diagrams.",
  "status": "In Progress",
  "priority": "High",
  "dueDate": "2026-09-10"
}
```

---

### 🛡️ Admin APIs (`/api/admin`)

> **Headers Required**: `Authorization: Bearer <ADMIN_JWT_TOKEN>`

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/users` | Private (Admin Only) | Get all registered users (Supports `?search=`) |
| `DELETE` | `/api/admin/users/:id` | Private (Admin Only) | Delete user and cleanup user tasks |
| `GET` | `/api/admin/tasks` | Private (Admin Only) | Get all tasks across system with populated user details |
| `GET` | `/api/admin/stats` | Private (Admin Only) | Get admin dashboard statistical counts |

#### Admin Dashboard Stats Response Example (`GET /api/admin/stats`):
```json
{
  "success": true,
  "stats": {
    "totalUsers": 2,
    "totalTasks": 4,
    "pendingTasks": 1,
    "inProgressTasks": 2,
    "completedTasks": 1
  }
}
```
