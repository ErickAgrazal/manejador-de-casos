require('dotenv').config();
const express = require('express');
const app = express();
const dbConfig = require('./dbConfig');
const { handleError }  = require('./helpers/error');
const { PORT = 3000 } = process.env;

// SETTINGS
var bodyParser = require('body-parser');

// MIDDLEWARES
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// ROUTES
// Asociar todas las rutas buscando de manera recursiva
// todo los controladores listados en la carpeta "controllers"
require('./controllers')(app);
// Ticket === Caso
// TODO:
// 1. Modelo de usuarios, para autneticación.
//      1.1 Crear usuario
//      1.2 Autenticar (login) (JWT?)
//      1.3 Cerrar sesión (logout) (Si es JWT, no es necesario)
// 2. Modelo de Ticket
//      2.1 Crear ticket
//      2.2 Leer Ticket
//      2.3 Actualizar Ticket
//      2.4 Eliminar Ticket (??????, tal ves desactivar.)
//      2.5 Asociar usuario a ticket
//      2.6 Desasociar usuario de un ticket

// STARTUP
dbConfig().then(() => {
    console.log('Acceso a la base de datos! :D');
    app.listen(PORT, () => {
        console.log(`Manejador de casos - Backend, ejecutando en http://localhost:${PORT}`);
    })
});
