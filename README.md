
A **role-based Ticket Management Backend API** built with **Node.js, Express, MongoDB**, and **JWT Authentication (Cookies)**.  
This system supports **Users**, **Agents**, and **Admins** with secure ticket creation, assignment, status updates, and comments.

---

##  Features

- User registration, login & logout
- JWT authentication using HTTP-only cookies
- Role-based authorization (User / Agent / Admin)
- Ticket creation with priority
- Ticket assignment by Admin
- Ticket status update by Agent/Admin
- Comment system with permission checks
- Secure & scalable REST API

---

##  Tech Stack

- Node.js
- Express.js
- MongoDB & Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- dotenv
- cookie-parser

---

---

##  Authentication
- JWT token stored in **HTTP-only cookies**
- Protected routes use `authenticate` middleware
- Role-based access using `authorize`

---


## 👤 .env
**Body**
```json
{
  "PORT" :5000
   "MONGODB_URL":
   "JWT_SECRET": 
}

```
## 👤 User APIs

### Register User
**POST** `/api/v1/users/register`

**Body**
```json
{
  "name": "Gagan ",
  "email": "gagan@gmail.com",
  "password": "123456",
  "role": "user" || "agent" || "admin"
}

```
### Login 
**POST** /api/v1/users/login`

```json
{
  "email": "gagan@gmail.com",
  "password": "123456",
}

```
### Ticket 
**POST** /api/v1/ticket`
```json
{
  "title": "Login not working",
  "description": "I cannot login to my account. It shows error 500.",
  "priority": "high"
}

```




