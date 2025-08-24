const express = require("express");
const connectDB = require("./config/db.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require('path');
require("dotenv").config({ path: path.resolve(__dirname, '.env') });


// Import routers
const userRoutes = require("./routes/user.js");
const todoRoutes = require("./routes/todo.js");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

console.log("MONGODB_URI:", process.env.MONGODB_URI ? "✅ Found" : "❌ Missing");
console.log("PORT:", process.env.PORT || "Using default 7000");
app.use(express.json());
app.use(cookieParser());

// Middleware
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({
    message: "Todo API Server is running! ",
    environment: process.env.NODE_ENV || "development",
    status: "Live",
    endpoints: {
      auth: {
        signup: "POST /signUp",
        login: "POST /login", 
        logout: "POST /logout",
        profile: "GET /profile"
      },
      todos: {
        getAllTodos: "GET /api/todos",
        createTodo: "POST /api/todos",
        updateTodo: "PATCH /api/todos/:id",
        deleteTodo: "DELETE /api/todos/:id"
      }
    }
  });
});

// Routes
app.use("/", userRoutes);
app.use("/api", todoRoutes);

connectDB()
  .then(() => {
    console.log("connection established.....");
    const port = process.env.PORT;
    app.listen(port, () => {
      console.log(`listening at port..........${port}`);
    });
  })
  .catch((error) => {
    console.log("Database cannot be connected" + error);
  });
