const jwt  = require("jsonwebtoken");
const User = require("../models/User");

const login = async (req, res) => {
    try {
        const { pseudo } = req.body;

        if (!pseudo || typeof pseudo !== "string" || pseudo.trim() === "") {
            return res.status(400).json({ message: "Le champ 'pseudo' est requis." });
        }

        const normalizedPseudo = pseudo.toLowerCase().trim();

        let user = await User.findOne({ pseudo: normalizedPseudo });

        if (!user) {
            // initialisation d'un nnouveau user
            user = await User.create({ pseudo: normalizedPseudo, bestScore: 0 });
            console.log(`Nouvel utilisateur créé : ${user.pseudo}`);
        }

        const payload = {
            _id:    user._id,
            pseudo: user.pseudo,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "24h" });

        return res.status(200).json({ token });

    } catch (error) {
        console.error("Erreur dans authController.login :", error);

        if (error.name === "ValidationError" || error.code === 11000) {
            return res.status(400).json({
                message: "Pseudo invalide : caractères alphanumériques uniquement."
            });
        }

        return res.status(500).json({ message: "Erreur interne du serveur." });
    }
};

module.exports = { login };