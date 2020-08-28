const express = require('express');
const router = express.Router(); //on créer un router d'express

const sauceCtrl = require('../controllers/sauces'); //On importe la logique métier
const auth = require('../middleware/auth'); //middleware pour la verification via token, on l'applique aux routes que l'on veut protéger
const multer = require('../middleware/multer-config');

router.post('/', auth, multer, sauceCtrl.createSauce); //en mettant la logique metier dans controllers on a maintenant des noms sémantiques claires
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.get('/', auth, sauceCtrl.getAllSauces);

module.exports = router; //Enfin on exporte le router du fichier 