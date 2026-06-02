const express    = require("express");
const mongoose   = require("mongoose");
const cors       = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const gameRoutes = require("./routes/gameRoutes");

const app        = express();
const PORT       = process.env.PORT       || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("MONGODB_URI est manquant dans le fichier .env");
    process.exit(1);
}
if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET est manquant dans le fichier .env");
    process.exit(1);
}

app.use(express.json());
app.use(cors({ origin: CLIENT_URL }));

mongoose.connect(MONGODB_URI)
    .then(() => console.log("MongoDB connecté"))
    .catch((err) => {
        console.error("Erreur MongoDB :", err);
        process.exit(1);
    });

// ── Routes ──────────────────────────────────────────────────────────────────
app.get("/api/ping", (req, res) => {
    res.json({ message: "Serveur PolyQuiz opérationnel" });
});

app.use("/api/auth", authRoutes);
app.use("/api", gameRoutes);

app.listen(PORT, () => {
    console.log(`Le serveur tourne sur http://localhost:${PORT}`);
});
