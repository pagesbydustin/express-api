const express = require("express");
const router = express.Router();
const { Game } = require("../models");

// Create a new game
router.post("/", async (req, res) => {
  try {
    const newGame = await Game.create(req.body);
    res.status(201).json(newGame);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all games
router.get("/", async (req, res) => {
  try {
    const games = await Game.findAll();
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single game by ID
router.get("/:id", async (req, res) => {
  try {
    const game = await Game.findByPk(req.params.id);
    if (!game) return res.status(404).json({ message: "Game not found" });
    res.json(game);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a game by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedGame = await Game.update(req.body, {
      where: { id: req.params.id },
      returning: true,
    });
    if (!updatedGame[1])
      return res.status(404).json({ message: "Game not found" });
    res.json(updatedGame[1]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a game by ID
router.delete("/:id", async (req, res) => {
  try {
    const rowsDeleted = await Game.destroy({ where: { id: req.params.id } });
    if (rowsDeleted === 0)
      return res.status(404).json({ message: "Game not found" });
    res.json({ message: "Game deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
