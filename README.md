# 🚀 Team Task Manager (MERN Stack)

A full-stack web application that allows users to create projects, assign tasks, and track progress with role-based access.

---

## 🌐 Live Demo

team-task-manager-ipve.vercel.app

---

## 📂 GitHub Repository

https://github.com/Tishya20/TeamTaskManager

---

## ✨ Features

* 🔐 User Authentication (Signup / Login using JWT)
* 📁 Project Creation & Management
* 👥 Basic Team Member Handling
* ✅ Task Creation & Assignment
* 📊 Task Status Tracking (Todo / In Progress / Done)
* 📋 Dashboard to view all projects & tasks

---

## 🛠️ Tech Stack

**Frontend**

* React.js (Vite)
* Axios
* React Router DOM

**Backend**

* Node.js
* Express.js

**Database**

* MongoDB Atlas

**Authentication**

* JSON Web Token (JWT)
* bcrypt.js


## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/team-task-manager.git
cd team-task-manager
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```env
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Run backend:

```bash
node server.js
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🔌 API Endpoints

### 🔐 Auth

* `POST /api/auth/register`
* `POST /api/auth/login`

### 📁 Projects

* `POST /api/projects` → Create project
* `GET /api/projects` → Get user projects

### ✅ Tasks

* `POST /api/tasks` → Create task
* `GET /api/tasks/:projectId` → Get tasks by project
* `PUT /api/tasks/:id` → Update task status

---

## 🚀 Deployment

* Backend: Railway
* Frontend: Vercel

---


---

## 📌 Future Improvements

* Role-based UI (Admin vs Member)
* Task deadlines & overdue tracking
* Improved UI/UX (Tailwind CSS)
* Notifications
* Real-time updates

---

## 👨‍💻 Author

**Mayank Swaraj**
📧 [tishya.singh2011@gmail.com](mailto:tishya.singh2011@gmail.com)

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!
