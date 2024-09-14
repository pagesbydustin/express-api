const express = require("express");
const router = express.Router();
const { User } = require("../models");

// Create a new user
router.post("/", async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a user by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedUser = await User.update(req.body, {
      where: { id: req.params.id },
      returning: true,
    });
    if (!updatedUser[1])
      return res.status(404).json({ message: "User not found" });
    res.json(updatedUser[1]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a user by ID
router.delete("/:id", async (req, res) => {
  try {
    const rowsDeleted = await User.destroy({ where: { id: req.params.id } });
    if (rowsDeleted === 0)
      return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
