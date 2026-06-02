const mongoose = require("mongoose");
require("dotenv").config();
const Question = require("./models/Question");

mongoose.connect(process.env.MONGODB_URI);

const seedQuestions = [
    {
        category: "NBA",
        text: "Qui détient le record de points marqués en carrière en NBA ?",
        options: ["Kareem Abdul-Jabbar", "Kobe Bryant", "LeBron James", "Michael Jordan"],
        correctAnswer: "LeBron James"
    },
    {
        category: "NBA",
        text: "Quelle franchise NBA a remporté le plus grand nombre de titres de championnat ?",
        options: ["Los Angeles Lakers", "Chicago Bulls", "Golden State Warriors", "Boston Celtics"],
        correctAnswer: "Boston Celtics"
    },
    {
        category: "NBA",
        text: "Qui a remporté le plus de trophées MVP de saison régulière NBA ?",
        options: ["LeBron James", "Michael Jordan", "Kareem Abdul-Jabbar", "Magic Johnson"],
        correctAnswer: "Kareem Abdul-Jabbar"
    },
    {
        category: "NBA",
        text: "Combien de titres NBA Michael Jordan a-t-il remportés avec les Chicago Bulls ?",
        options: ["4", "5", "6", "7"],
        correctAnswer: "6"
    },
    {
        category: "Moto GP",
        text: "Quel pilote de Moto GP est surnommé 'The Doctor' ?",
        options: ["Marc Márquez", "Valentino Rossi", "Jorge Lorenzo", "Casey Stoner"],
        correctAnswer: "Valentino Rossi"
    },
    {
        category: "Formule 1",
        text: "Quelle écurie détient le plus grand nombre de titres Constructeurs en Formule 1 ?",
        options: ["Mercedes", "Red Bull", "McLaren", "Ferrari"],
        correctAnswer: "Ferrari"
    },
    {
        category: "Formule 1",
        text: "Combien de titres mondiaux Lewis Hamilton a-t-il remportés en Formule 1 ?",
        options: ["5", "6", "7", "8"],
        correctAnswer: "7"
    },
    {
        category: "Manga / Animé",
        text: "Quel manga est le plus vendu de tous les temps dans le monde ?",
        options: ["Dragon Ball", "Naruto", "One Piece", "Bleach"],
        correctAnswer: "One Piece"
    },
    {
        category: "Manga / Animé",
        text: "Qui est l'auteur du manga « L'Attaque des Titans » (Shingeki no Kyojin) ?",
        options: ["Masashi Kishimoto", "Eiichiro Oda", "Hajime Isayama", "Akira Toriyama"],
        correctAnswer: "Hajime Isayama"
    },
    {
        category: "Manga / Animé",
        text: "Dans Naruto, comment s'appelle le village natal de Naruto Uzumaki ?",
        options: [
            "Village caché du Sable",
            "Village caché des Feuilles",
            "Village caché de la Brume",
            "Village caché des Nuages"
        ],
        correctAnswer: "Village caché des Feuilles"
    }
];

async function seedDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connexion à MongoDB établie.");
 
        const { deletedCount } = await Question.deleteMany({});
        console.log(`Collection purgée : ${deletedCount} questions supprimées.`);
 
        const inserted = await Question.insertMany(seedQuestions);
        console.log(`${inserted.length} questions insérée(s) avec succès.`);
 
        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error("Erreur lors du peuplement de la base de données :", error);
        await mongoose.connection.close();
        process.exit(1);
    }
}

seedDatabase();