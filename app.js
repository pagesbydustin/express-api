require("dotenv").config();
const express = require("express");
const app = express();
const { sequelize } = require("./models");
const gameRoutes = require("./routes/gameRoutes");

// Middleware for parsing JSON
app.use(express.json());

// Use game routes
app.use("/games", gameRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Game API!" });
});

// Synchronize models with database and start server
const PORT = process.env.PORT || 3000;
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
