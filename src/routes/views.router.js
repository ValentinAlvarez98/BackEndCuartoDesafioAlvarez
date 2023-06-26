import express from 'express';
import ProductManager from '../manager/product_manager.js';

// Se crea el enrutador de vistas.
const viewsRouter = express.Router();

// Se crea una instancia del ProductManager.
const productManager = new ProductManager();

// Se crea el endpoint para el home.
viewsRouter.get('/home', async (req, res) => {

      // Se intenta ejecutar la consulta.
      try {

            // Se obtienen los productos.
            const products = await productManager.getProducts();
            res.render('home', {
                  products
            });

      } catch (error) {

            // Si hubo un error al ejecutar la consulta, se envía un mensaje de error.
            console.error('Error al obtener los productos:', error);
            res.status(500).send('Error al obtener los productos');

      };
});

// Se crea el endpoint para mostrar los productos en tiempo real, utilizando socket.io.
viewsRouter.get('/realtimeproducts', async (req, res) => {

      // Se intenta ejecutar la consulta.
      try {

            // Se obtienen los productos.
            const products = await productManager.getProducts();

            // Se envían los productos.
            res.render('realtimeproducts', {
                  products
            });

      } catch (error) {

            // Si hubo un error al ejecutar la consulta, se envía un mensaje de error.

            console.error('Error al obtener los productos:', error);
            res.status(500).send('Error al obtener los productos');

      };

});

// Se exporta el enrutador de vistas.
export default viewsRouter;