const express = require('express'); //On importe la méthode(framework) express, pour pouvoir créer par la suite une application express
const bodyParser = require('body-parser'); //on importe la méthode body-parser, permet de transformer le corps d'une requête en objet Javascript utilisable
const mongoose = require('mongoose'); //on importe mongoose, ce qui permet d'acceder à notre base de donnée en ligne
const path = require('path');

const sauceRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');

const dotenv = require('dotenv').config();
//console.log(dotenv.parsed);

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_NAME}`,
    {
        userNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(()=>console.log('Connexion à MongoDB réussie !'))
    .catch(()=>console.log('Connexion à MongoDB échouée !'));

const app = express(); //on créer une application express

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());

app.use('/images', express.static( path.join(__dirname, 'images'))); //pour servir un dossier static avec express on utilise express.static

app.use('/api/sauces', sauceRoutes); //on importe sauceRoutes et on l'applique à la route /api/sauce
app.use('/api/auth', userRoutes);

module.exports = app; // On exporte l'application(constante) crée