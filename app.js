const express = require("express");
const app = express();

// Middleware for parsing JSON
app.use(express.json());

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Express API!" });
});

// Example of a POST route
app.post("/data", (req, res) => {
  const data = req.body;
  res.json({ receivedData: data });
});

// Environment variable port, default to 3000 if not defined
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
