// Se hacer las importaciones necesarias.
import express from 'express';
import http from 'http';
import {
      Server
} from 'socket.io';
import exphbs from 'express-handlebars';
import path from 'path';
import {
      fileURLToPath
} from 'url';

// Se importan los enrutadores.
import viewsRouter from './routes/views.router.js';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';

// Se crea la aplicación de express.
const app = express();

// Se crea el servidor http utilizando la aplicación de express.
const server = http.createServer(app);

// Se crea la instancia de socket.io utilizando el servidor http.
const io = new Server(server);

// Se crea una constante para obtener la ruta del directorio actual.
const __filename = fileURLToPath(
      import.meta.url);

// Se crea una constante para obtener el nombre del directorio actual.
const __dirname = path.dirname(__filename);

// Se crea una constante para el puerto.
const port = 8080;

// Se crea una instancia de express-handlebars.
const expHbsInstance = exphbs.create({});

// Se configura el motor de plantillas.
app.engine('handlebars', expHbsInstance.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));


app.use('/', viewsRouter);
app.use(express.json());
app.use(express.urlencoded({
      extended: true
}));
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Se configura la conexión de socket.io.
io.on('connection', (socket) => {
      console.log('Nuevo cliente conectado!');
      socket.emit('mensaje', 'Bienvenido!');
      socket.on('disconnect', () => {
            console.log('Cliente desconectado');
      });
});

// Se inicia el servidor.
server.listen(port, () => {
      console.log(`Servidor iniciado en el puerto ${port}`);
});