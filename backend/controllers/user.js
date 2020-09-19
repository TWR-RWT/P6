const bcrypt = require('bcrypt'); // On importe bcrypt qui va nous permettre de crypter les mot de passe
const jwt = require('jsonwebtoken'); // On importe jsonwebtoken pour pouvoir créer des token

const User = require('../models/user');

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) //on hash le mot de passe que l'on reçoit, ici on fait 10 tours, plus on fait de tour plus le cryptage sera puissant mais également gourmant
        .then(hash => {
            const user = new User({
                email: req.body.email, //comme adresse email on passe l'email passé dansla requête
                password: hash //comme mot de passe on passe le hash que l'on vient de faire
            });
            user.save() //on enregistre dans la base de données l'utilisateur que l'on vient de créer
                .then(() => res.status(201).json({message: 'Utilisateur créé !'}))
                .catch(error => res.status(400).json({error}));
        })
        .catch(error => res.status(500).json({error}));
};

exports.login = (req, res, next) => {
    User.findOne({email: req.body.email}) //On vient chercher l'utilisateur pour qui l'adresse mail correspond à celle rentrée dans la requête
        .then(user => {
            if (!user) { //si on a pas trouvé l'adresse mail dans la bdd
                return res.status(401).json({message: 'Utilisateur non trouvé !'});
            }
            bcrypt.compare(req.body.password, user.password) //on compare le mot de passe rentrée avec le hash que l'on a enregistrée dans la bdd pour ce user
                .then(valid => { //on récupère un booléan false ou true que l'on doit traiter
                    if (!valid) {
                        return res.status(401).json({error: 'Mot de passe incorrect !'});
                    }
                    res.status(200).json({ //mot de passe valide, on renvoie un objet json avec un user id et un token
                        userId: user._id,
                        token: jwt.sign( //on utilise jwt de jsonwebtoken pour créer un token
                            { userId: user._id }, // le premier argument facultatif représente les données que l'on veut encoder, on appelle ça le payload
                            'RANDOM_TOKEN_SECRET', // le deuxième argument est la clé secrète pour l'encodage
                            { expiresIn: '24h'} // le troisième argument est un argument d'expiration, le token expirera au bout de x temps
                        )
                    });
                })
                .catch(error => res.status(500).json({error})); //également un problème serveur
        })
        .catch(error => res.status(500).json({error})); //le catch va capter les problèmes de connexion mais si l'adresse mail n'existe pas dans la base de donnée celà va dans le then pas dans le catch !
};