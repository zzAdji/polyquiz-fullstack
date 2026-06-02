# PolyQuiz OUMATE ALIM ALHADJI 

## Lancer la base de données

MongoDB Atlas est utilisé, donc aucune base locale à démarrer.

---

## Lancer le serveur Back-End

Dans le dossier `server/polyquiz-api` :

```bash
npm install
```

Puis compléter le `.env.example`. Ensuite :

```bash
nodemon server.js
```
# Changer les questions de la BD

```bash
nodemon seed.js
```

Le serveur démarre sur :

```bash
http://localhost:5000
```

---

## Lancer le Front-End React

Dans le dossier `client` :

```bash
npm install
npm run dev
```

L’application démarre sur :

```bash
http://localhost:5173
```