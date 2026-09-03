# 📋 Mini Task Management System

A production-ready full-stack Task Management Application built with a **Node.js/Express REST API**, **MongoDB Atlas**, **JWT Authentication**, **Role-Based Access Control (Admin vs User)**, and a **React + Vite Frontend**.

---

## 🚀 Technologies Used

### **Backend**:
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (MongoDB Atlas Cloud Cluster) with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **Security & Password Hashing**: `bcryptjs`
- **Middlewares**: CORS, Custom JWT Verification, Role Authorization, Centralized Error Handling

### **Frontend**:
- **Library**: React.js (Bootstrapped with Vite)
- **HTTP Client**: Axios (with Request Interceptors for automatic JWT `Bearer` token attachment)
- **Icons & UI**: Lucide React Icons & Vanilla CSS
- **State Management**: React Context API (`AuthContext`)

---

## 📁 Directory Structure

```
Mini Task Management App/
├── backend/
│   ├── config/               # Database connection (db.js)
│   ├── controllers/          # Controller logic (auth, task, admin)
│   ├── middleware/           # Auth, Role authorization & Error handling middlewares
│   ├── models/               # Mongoose schemas (User.js, Task.js)
│   ├── routes/               # Express routing (auth, task, admin)
│   ├── .env.example          # Environment variables template
│   ├── seed.js               # Database reset & seeding script
│   ├── server.js             # Express application entry point
│   └── package.json          # Dependencies & scripts
└── frontend/
    ├── src/
    │   ├── components/       # Reusable components (Navbar, TaskForm, TaskList, Toast)
    │   ├── context/          # Global AuthContext provider
    │   ├── pages/            # Page views (Login, UserDashboard, AdminDashboard)
    │   ├── services/         # Axios instance configuration
    │   └── App.jsx           # App routing & protection
    ├── package.json
    └── vite.config.js
```

---

## ⚙️ Environment Variables Setup (`.env`)

Create a `.env` file inside the `backend/` directory with the following variables (or base it on `.env.example`):

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database_name>?retryWrites=true&w=majority
JWT_SECRET=supersecret_jwt_key_mini_task_app_2026_safe
JWT_EXPIRE=30d
```

> **Note**: Replace `<username>`, `<password>`, `<cluster>`, and `<database_name>` with your actual MongoDB Atlas connection credentials.

---

## 📦 Step-by-Step Setup & Run Instructions

Follow these instructions to run the application successfully on your local machine:

### **1. Setup & Start Backend Server**

1. Open terminal and navigate to the `backend/` directory:
   ```bash
   cd backend
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Seed initial database data (Admin & User accounts + Sample Tasks):
   ```bash
   npm run seed
   ```

4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The backend server will run at:* `http://localhost:5000`

---

### **2. Setup & Start Frontend Application**

1. Open a second terminal window and navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Start the Vite frontend development server:
   ```bash
   npm run dev
   ```
   *The frontend application will run at:* `http://localhost:5173`

---

## 🔑 Pre-seeded Login Credentials

After running `npm run seed`, you can log in using any of the following accounts:

| Account Type | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Admin Account** | `admin@gmail.com` | `password123` | Full access to Admin Panel, User Deletion, System Stats & All Tasks |
| **Regular User 1** | `john@gmail.com` | `password123` | Personal Task Management (Create, Edit, Delete, Filter) |
| **Regular User 2** | `sophia@gmail.com` | `password123` | Personal Task Management |
| **Regular User 3** | `jane@gmail.com` | `password123` | Personal Task Management |

---

## 📌 Assumptions Made

1. **Self-Registration Disabled**: End-user registration is disabled to enforce organizational security; user accounts are provisioned via administrative seeding (`npm run seed`) or admin management endpoints.
2. **Database Persistence**: MongoDB Atlas (or a local MongoDB instance) is used for database persistence via Mongoose ODM.
3. **CORS & Port Configuration**: The backend REST API runs on port 5000 (`http://localhost:5000`) and permits cross-origin requests from the React dev server (`http://localhost:5173`).
4. **JWT Expiration**: JWT authentication tokens expire in 30 days by default (`JWT_EXPIRE=30d`).

---

## 🔑 API Endpoints Reference

### 🔐 Auth APIs (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Public | Authenticate user credentials & return JWT token + user role |
| `GET` | `/api/auth/me` | Private | Get logged-in user profile details |

---

### 📋 Task APIs (`/api/tasks`) *(Headers Required: `Authorization: Bearer <TOKEN>`)*
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/tasks` | Private (User/Admin) | Get tasks (Supports `?search=`, `?status=`, `?priority=`) |
| `GET` | `/api/tasks/:id` | Private (Owner/Admin) | Get single task details by ID |
| `POST` | `/api/tasks` | Private (User/Admin) | Create a new task |
| `PUT` | `/api/tasks/:id` | Private (Owner/Admin) | Update an existing task |
| `DELETE` | `/api/tasks/:id` | Private (Owner/Admin) | Delete a task |

---

### 🛡️ Admin APIs (`/api/admin`) *(Headers Required: `Authorization: Bearer <ADMIN_TOKEN>`)*
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/users` | Private (Admin Only) | Get all registered users |
| `DELETE` | `/api/admin/users/:id` | Private (Admin Only) | Delete user and cleanup user tasks |
| `GET` | `/api/admin/tasks` | Private (Admin Only) | Get all tasks across all users |
| `GET` | `/api/admin/stats` | Private (Admin Only) | Get admin dashboard statistics |
