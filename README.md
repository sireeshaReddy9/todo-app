# Simple Todo App - Full Stack

A simple todo application with user authentication.

## Tech Stack
- **Frontend:** React, Redux, React Router
- **Backend:** Node.js, Express, MongoDB, JWT
- **Authentication:** Cookie-based JWT

## Setup

### Backend
1. Make sure MongoDB is running
2. Start backend: `node app.js` (port 7000)

### Frontend
1. Install dependencies: `npm install`
2. Start app: `npm start` (port 3000)

## Features
- User signup/login
- Add, edit, delete todos
- Mark todos as complete
- User-specific todos
- Persistent login with cookies

## API Endpoints
- `POST /signUp` - Register
- `POST /login` - Login  
- `POST /logout` - Logout
- `GET /profile` - Get user
- `GET /api/todos` - Get todos
- `POST /api/todos` - Create todo
- `PATCH /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo
