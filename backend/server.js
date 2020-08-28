const http = require('http'); //import du paquage http de node, cet object va nous permettre de créer le serveur
const app = require('./app'); //import de notre page app où se trouve l'application

const normalizePort = val => {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};
const port = normalizePort(process.env.PORT || '3000'); //la fct normalize renvoie un port valide, qu'il soit fourni sous forme d'un numéro ou d'une chaîne
app.set('port', port);

const errorHandler = error => { //la fct errorHandler recherche les différentes erreurs, les gère et les enregistre dans le serveur
    if (error.syscall !== 'listen') {
        throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.');
            process.exit(1);
            break;
        default:
            throw error;
    }
};

//app.set('port', process.env.PORT || 3000); //On précise sur quel port l'application express va tourner
const server = http.createServer(app); //on passe la fonction app à notre serveur http pour traiter toutes les requêts qu'il recevra

server.listen(port);