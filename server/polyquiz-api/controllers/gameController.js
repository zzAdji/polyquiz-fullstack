const Question = require("../models/Question");
const User = require("../models/User");

const getQuestions = async (req, res) => {
    try {
        const questions = await Question.find();
        return res.status(200).json(questions);
    } catch (error) {
        console.error("Erreur dans gameController.getQuestions :", error);
        return res.status(500).json({ message: "Erreur interne du serveur." });
    }
};

const updateScore = async (req, res) => {
    try {
        const { score } = req.body;

        if (typeof score !== "number" || !Number.isFinite(score) || score < 0) {
            return res.status(400).json({
                message: "Le champ 'score' doit etre un nombre positif."
            });
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: "Utilisateur introuvable." });
        }

        if (score > user.bestScore) {
            user.bestScore = score;
            await user.save();
        }

        return res.status(200).json({
            pseudo: user.pseudo,
            bestScore: user.bestScore
        });
    } catch (error) {
        console.error("Erreur dans gameController.updateScore :", error);
        return res.status(500).json({ message: "Erreur interne du serveur." });
    }
};

const getLeaderboard = async (req, res) => {
    try {
        const leaderboard = await User.find()
            .sort({ bestScore: -1 })
            .limit(10)
            .select("pseudo bestScore -_id");

        return res.status(200).json(
            leaderboard.map((user) => ({
                pseudo: user.pseudo,
                score: user.bestScore
            }))
        );
    } catch (error) {
        console.error("Erreur dans gameController.getLeaderboard :", error);
        return res.status(500).json({ message: "Erreur interne du serveur." });
    }
};

module.exports = {
    getQuestions,
    updateScore,
    getLeaderboard
};
