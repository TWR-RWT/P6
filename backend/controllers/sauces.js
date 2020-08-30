const sauce = require('../models/sauce');
const fs = require('fs'); //pour acceder aux différentes oppérations liées au système de fichiers

exports.createSauce = (req, res, next) => {
    const sauceObjet = JSON.parse(req.body.sauce);
    delete sauceObjet._id;
    const Sauce = new sauce({
        ...sauceObjet, //raccourcis pour récupérer la model de la requête
        likes: 0, //lors de la création d'une nouvelle sauce les likes et dislikes sont égales à 0
        dislikes: 0,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` //on génère l'url de l'image de façon dynamique
    });
    Sauce.save()
        .then(() => res.status(201).json({message: 'objet enregistré !'}))
        .catch(error => res.status(400).json({error}));
};

exports.modifySauce = (req, res, next) => {
    const sauceObjet = req.file ? //est ce qu'il y a une image
        {
            ...JSON.parse(req.body.Sauce), //On récupère toutes les informations de l'objet se trouvant dans la requête
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` //et on génère la nouvelle imageUrl
        } : { ...req.body}; //si il n'existe pas on fait une copie de req.body
    sauce.updateOne({_id: req.params.id}, {...sauceObjet, _id: req.params.id})
        .then(() => res.status(200).json({message: 'Objet modifié !'}))
        .catch(error => res.status(400).json({error}));
};

exports.deleteSauce = (req, res, next) => {
    sauce.findOne({_id: req.params.id}) //on trouve l'objet dans la bdd
        .then(Sauce => {
            const filename = Sauce.imageUrl.split('/images/')[1]; //on extrait le nom du fichier à supprimer
            fs.unlink(`images/${filename}`, () => { //on le supprime avec fs.unlink
                sauce.deleteOne({ _id: req.params.id }) // Dans le callback on fait la suppression de l'objet dans la bdd
                    .then(() => res.status(200).json({message: 'Objet supprimé !'}))
                    .catch(error => res.status(400).json({error}));
            });
        })
        .catch(error => res.status(500).json({error}));  
};

exports.getOneSauce = (req, res, next) => {
    sauce.findOne({ _id: req.params.id}) //on veut que l'id soit le même que celui du paramètre de requête
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({error}));
};

exports.getAllSauces = (req, res, next) => { // premier argument l'url qui est visé par l'apllication (le endpoint ou la route)
sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};

exports.likeSauce = (req, res, next) => {
    if (req.body.like === 1) { // Dans le cas d'un like:
        sauce.updateOne({ _id: req.params.id }, { $inc: { likes: req.body.like++ }, $push: { usersLiked: req.body.userId } })
            .then(() => res.status(200).json({ message: 'La sauce a été likée !' }))
            .catch(error => res.status(400).json({ error }));
    } else if (req.body.like === -1) { // Dans le cas d'un dislike:
        sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: req.body.like++ }, $push: { usersDisliked: req.body.userId } })
            .then(() => res.status(200).json({ message: 'La sauce a été likée !' }))
            .catch(error => res.status(400).json({ error }));
    } else { // Dans le cas pas de like: req.body.like === 0
        sauce.findOne({ _id: req.params.id })
            .then(sauce => {
                if (sauce.usersLiked.includes(req.body.userId)) { //si l'utilisateur avait précedement liké la sauce
                    sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } })
                        .then(() => res.status(200).json({ message: 'Un like de moins !' }))
                        .catch(error => res.status(400).json({ error }))
                } else if (sauce.usersDisliked.includes(req.body.userId)) { //si l'utilisateur avait précedement disliké la sauce
                    sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 } })
                        .then(() => res.status(200).json({ message: 'Un dislike de moins !' }))
                        .catch(error => res.status(400).json({ error }))
                }
            })
            .catch(error => res.status(400).json({ error })); 
    }
}

