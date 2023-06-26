// Se conecta el cliente al servidor
const socket = io();

// Se escucha el evento 'mensaje' y se muestra en consola el mensaje recibido.
socket.on('mensaje', (mensaje) => {
      console.log('Mensaje recibido:', mensaje);
});