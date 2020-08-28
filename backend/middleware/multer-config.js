const multer = require('multer');

const MIME_TYPES ={
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
};

const storage = multer.diskStorage({ //diskstorage permet d'enregistrer sur le disk
    destination: (req, file, callback) =>{ //on dit à multer où on veut enregistrer les fichiers
        callback(null, 'images') //on appelle directement le callback, null signifie qu'il n'y a pas eu d'erreurs, et on passe le nom du dossier où seront stockés les fichiers
    },
    filename: (req, file, callback) => { //le deuxième argument de multer lui explique quel nom de fichier utiliser
        const name = file.originalname.split(' ').join('_'); //on élimine le problème des espaces
        const extension = MIME_TYPES[file.mimetype]; //on rajoute l'extension
        callback(null, name + Date.now() + '.' + extension); //on construit le nom du fichier auquel on ajouté un timestamp pour le rendre le plus unique possible
    }
});

module.exports = multer({storage: storage}).single('image'); //on passe la methode single car il s'agit d'un fichier unique, en précisant le format image