# 🔐 Locker - Locker Reservation System

A web application for online locker reservations, similar to cinema seat booking. Users can reserve lockers for a specified duration, with automatic expiration and email notifications.

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)

## 🎯 Overview

Locker is a Node.js web application that allows users to:
- Reserve lockers online with a chosen duration
- Receive email notifications at each step (confirmation, reminder, expiration)
- Automatic locker release when reservation expires

Admins can manage lockers (create, update, delete) and monitor reservations.

## 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime environment |
| **Express 5** | Web framework |
| **MongoDB** | Database |
| **Mongoose** | MongoDB ODM |
| **EJS** | Server-side templating |
| **Bootstrap 5** | UI styling & responsive design |
| **JWT** | Authentication tokens |
| **bcrypt** | Password hashing |
| **Swagger** | API documentation |
| **Nodemon** | Development hot-reloading |
| **Docker Compose** | Database containerization |

## ✨ Features

### Authentication & User Management
- [x] User registration with email/password
- [x] User login with JWT tokens
- [x] Password reset via email
- [x] User roles (User / Admin)

### Locker Management (Admin)
- [x] Add, edit, delete lockers
- [x] Locker properties: Number, Size, Status, Price

### Reservation System
- [x] Browse available lockers
- [x] Select locker and reservation duration
- [x] Reservation confirmation
- [ ] Optional: Stripe payment integration (mock)

### Automatic Expiration
- [x] Automated reservation expiration handling
- [x] Locker auto-release when reservation ends

### Email Notifications
- [x] Reservation confirmation email
- [x] Reminder before expiration
- [x] Password reset email

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.x
- Docker & Docker Compose (for MongoDB and MailCatcher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/CyrilLeblanc/locker.git
   cd locker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start MongoDB with Docker**
   ```bash
   docker compose up -d
   ```

5. **Run the application**
   ```bash
   # Development mode (with hot-reload)
   npm run dev
   ```

6. **Access the application**
   - App: http://localhost:3000
   - API Docs (Swagger): http://localhost:3000/api-docs
   - Mongo Express (DB Admin): http://localhost:8081
   - MailCatcher (Email testing): http://localhost:1080

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# Server
PORT=3000

# MongoDB
MONGO_USERNAME=appuser
MONGO_PASSWORD=apppassword
MONGO_HOST=localhost
MONGO_PORT=27017
MONGO_DB_NAME=locker

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Email (for notifications)
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_FROM=donotrespond@locker.com
```

## 📁 Project Structure

```
locker/
├── server.js              # Application entry point
├── package.json           # Dependencies and scripts
├── docker-compose.yaml    # MongoDB & Mongo Express setup
├── .env                   # Environment variables
├── docs/                  # Project documentation
├── public/                # Static assets (CSS, JS, images)
├── views/                 # EJS templates
│   ├── layouts/           # Page layouts
│   ├── pages/             # Page templates
│   ├── partials/          # Reusable components
│   └── components/        # UI components
├── src/
│   ├── core/              # Core utilities (DB connection)
│   ├── models/            # Mongoose models
│   │   ├── user.js        # User model
│   │   ├── locker.js      # Locker model (TODO)
│   │   └── reservation.js # Reservation model (TODO)
│   └── routes/
│       ├── api/           # API endpoints
│       │   ├── auth.js    # Authentication routes
│       │   └── index.js   # API router
│       └── pages/         # Page rendering routes
└── scrum/                 # Agile tickets and backlog
```

## 📊 Data Models

### User
```javascript
{
  username: String,
  email: String (unique),
  passwordHash: String,
  role: String (enum: ['user', 'admin']),
  resetPasswordToken: String,
  resetPasswordExpires: Date
}
```

### Locker
```javascript
{
  number: String (unique),
  size: String (enum: ['small', 'medium', 'large']),
  status: String (enum: ['available', 'reserved', 'maintenance']),
  price: Number
}
```

### Reservation
```javascript
{
  user: ObjectId (ref: User),
  locker: ObjectId (ref: Locker),
  startDate: Date,
  endDate: Date,
  status: String (enum: ['active', 'expired', 'cancelled']),
  reminderSent: Boolean (default: false)
}
```
