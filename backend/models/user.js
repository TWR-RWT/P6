const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true }, //on rajoute unique: true pour pas que les utilisateurs puissent utiliser la même adresse mail
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator); //en ajoutant le plugin que l'on vient d'importer on s'assure de ne pas avoir plusieurs utilisateurs avec la même adresse mail

module.exports = mongoose.model('User', userSchema);