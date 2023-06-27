// Se importa el módulo express para poder crear el servidor.
import express from 'express';

// Se importa el módulo handlebars para poder utilizarlo como motor de plantillas.
import handlebars from 'express-handlebars';

// Se importa el módulo path para poder utilizar rutas relativas.
import __dirname from './utils.js';

// Se importa el enrutador de vistas.
import viewsRouter from './routes/views.router.js';

// Se importa el módulo socket.io.
import {
      Server
} from 'socket.io';

// Se crea el servidor express.
const app = express();

const port = 8080;

// Se crea el servidor HTTP utilizando el servidor express.
const httpServer = app.listen(port, () => {
      console.log(`Servidor escuchando en el puerto ${port}`);
});

// Se crea el servidor de socket.io.
const socketServer = new Server(httpServer);

app.use(express.json());
app.use(express.urlencoded({
      extended: true
}));

// Se configura el motor de plantillas.
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));
app.use('/', viewsRouter);

// Se escucha el evento connection.
socketServer.on('connection', socket => {
      console.log("Nuevo cliente conectado!");
});

export default socketServer;