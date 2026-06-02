const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
    getQuestions,
    updateScore,
    getLeaderboard
} = require("../controllers/gameController");

// GET /api/questions
router.get("/questions", getQuestions);

// POST /api/users/score
router.post("/users/score", authMiddleware, updateScore);

// GET /api/leaderboard
router.get("/leaderboard", getLeaderboard);

module.exports = router;
