require("dotenv").config();
const express = require("express");
const { sequelize } = require("./models");
const gameRoutes = require("./routes/gameRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes"); // Import auth routes

const app = express();
app.use(express.json());

// Routes
app.use("/games", gameRoutes);
app.use("/users", userRoutes);
app.use("/auth", authRoutes); // Add auth routes

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Game API!" });
});

const PORT = process.env.PORT || 3000;
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
