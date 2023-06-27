// Se hacen las importaciones necesarias.
import express from 'express';
import ProductManager from '../manager/product_manager.js';
import CartManager from '../manager/cart_manager.js';

// Se crea el enrutador.
const router = express.Router();

// Se crean las instancias de los managers.
const productManager = new ProductManager();
const cartManager = new CartManager();

// Se crea el endpoint home, para mostrar los productos.
router.get('/home', async (req, res) => {

      // Se intenta ejecutar la consulta.
      try {

            // Se obtienen los productos.
            const products = await productManager.getProducts();

            // Se renderiza la vista home, pasando los productos como parámetro.
            res.render('home', {
                  products
            });

      } catch (error) {

            // Si ocurre un error, se muestra un mensaje en consola y se envía un mensaje de error al cliente.
            console.error('Error al obtener los productos:', error);
            res.status(500).send('Error al obtener los productos');

      }

});

// Endpoint para mostrar los productos en tiempo real.
router.get('/realtimeproducts', async (req, res) => {

      // Se intenta ejecutar la consulta.
      try {

            // Se obtienen los productos.
            const products = await productManager.getProducts();

            // Se renderiza la vista realtimeproducts, pasando los productos como parámetro.
            res.render('realtimeproducts', {
                  products
            });


      } catch (error) {

            // Si ocurre un error, se muestra un mensaje en consola y se envía un mensaje de error al cliente.
            console.error('Error al obtener los productos:', error);
            res.status(500).send('Error al obtener los productos');

      }

});

// Se crea el endpoint para crear un carrito.
router.post('/carts', async (req, res) => {

      // Se intenta ejecutar la consulta.
      try {

            // Se crea el carrito.
            const cart = await cartManager.createCart();
            res.send(cart);

      } catch (error) {

            // Si ocurre un error, se muestra un mensaje en consola y se envía un mensaje de error al cliente.
            res.status(500).send({
                  status: 'error',
                  error: 'Error al ejecutar la consulta.'
            });

      };

});

// Se crea el endpoint para obtener un carrito por id.
router.get('/carts/:cid', async (req, res) => {

      // Se obtiene el id del carrito.
      const id = req.params.cid;

      // Se intenta ejecutar la consulta.
      try {

            // Se obtiene el carrito.
            const cart = await cartManager.getCartById(Number(id));

            // Si no se encuentra el carrito, se envía un mensaje de error al cliente.
            if (!cart) {

                  return res.status(404).send({
                        status: 'error',
                        error: `No se ha podido encontrar el carrito con el id: ${Number(id)}`
                  });

            }

            // Se envía el carrito al cliente.
            res.send(cart);

      } catch (error) {

            // Si ocurre un error, se muestra un mensaje en consola y se envía un mensaje de error al cliente.
            res.status(500).send({
                  status: 'error',
                  error: 'Error al ejecutar la consulta.'
            });

      }

});

// Se crea el endpoint para agregar un producto al carrito.
router.post('/carts/:cid/product/:pid', async (req, res) => {

      // Se obtienen los ids del carrito y del producto.
      const cartId = req.params.cid;
      const productId = req.params.pid;

      // Se intenta ejecutar la consulta.
      try {

            // Se agrega el producto al carrito.
            const cart = await cartManager.addToCart(Number(cartId), Number(productId));

            // Si no se encuentra el carrito o el producto, se envía un mensaje de error al cliente.
            if (cart === null) {
                  return res.status(404).send({
                        status: 'error',
                        error: `No se ha podido encontrar el carrito con el id: ${Number(cartId)} o el producto con el id: ${Number(productId)}`
                  });
            }

            // Se envía el carrito al cliente.
            res.status(201).send({
                  status: 'success',
                  message: 'Producto agregado al carrito.',
                  cart
            });

      } catch (error) {

            res.status(500).send({
                  status: 'error',
                  error: 'Error al ejecutar la consulta.'
            });

      };

});

// Se crea el endpoint para obtener todos los productos o una catidad limitada de productos.
router.get('/products', async (req, res) => {

      // Se obtiene el límite de productos.
      const limit = req.query.limit;

      // Se intenta ejecutar la consulta.
      try {

            // Se obtienen los productos.
            const products = await productManager.getProducts();

            // Si no se especifica un límite, se envían todos los productos.
            if (!limit) {
                  return res.send(products);
            }

            // Se envían los productos limitados.
            res.send(products.slice(0, limit));

      } catch (error) {

            // Si ocurre un error, se muestra un mensaje en consola y se envía un mensaje de error al cliente.
            res.status(500).send({
                  status: 'error',
                  error: 'Error al ejecutar la consulta.'
            });

      };

});

// Se crea el endpoint para obtener un producto por id.
router.get('/products/:productId', async (req, res) => {

      // Se obtiene el id del producto.
      const id = req.params.productId;

      // Se intenta ejecutar la consulta.
      try {

            // Se obtiene el producto.
            const product = await productManager.getProductById(Number(id));

            // Si no se encuentra el producto, se envía un mensaje de error al cliente.
            if (!product) {
                  return res.status(404).send({
                        status: 'error',
                        error: `No se ha podido encontrar el producto con el id: ${Number(id)}`
                  });
            };

            res.send(product);

      } catch (error) {

            res.status(500).send({
                  status: 'error',
                  error: 'Error al ejecutar la consulta.'
            });

      };

});

// Se crea el endpoint para crear un producto.
router.post('/products', async (req, res) => {

      // Se obtiene el producto.
      const product = req.body;

      // Se intenta ejecutar la consulta.
      try {

            // Se crea el producto.
            await productManager.addProduct(
                  product.title,
                  product.description,
                  product.code,
                  product.price,
                  product.status,
                  product.stock,
                  product.category,
                  product.thumbnails
            );

            res.status(201).send('Producto agregado correctamente.');

      } catch (error) {

            // Si ocurre un error, se muestra un mensaje en consola y se envía un mensaje de error al cliente.
            res.status(500).send({
                  status: 'error',
                  error: 'Error al ejecutar la consulta.'
            });

      };

});

// Se crea el endpoint para actualizar un producto por id.
router.put('/products/:productId', async (req, res) => {

      // Se obtiene el id del producto y el producto.
      const id = req.params.productId;
      const product = req.body;

      // Se intenta ejecutar la consulta.
      try {

            // Se actualiza el producto.
            await productManager.updateProduct(
                  Number(id),
                  product.title,
                  product.description,
                  product.code,
                  product.price,
                  product.status,
                  product.stock,
                  product.category,
                  product.thumbnails
            );

            res.send('Producto actualizado correctamente.');

      } catch (error) {

            // Si ocurre un error, se muestra un mensaje en consola y se envía un mensaje de error al cliente.
            res.status(500).send({
                  status: 'error',
                  error: 'Error al ejecutar la consulta.'
            });

      };

});

// Se crea el endpoint para eliminar un producto por id.
router.delete('/products/:productId', async (req, res) => {

      // Se obtiene el id del producto.
      const id = req.params.productId;

      // Se intenta ejecutar la consulta.
      try {

            // Se elimina el producto.
            await productManager.deleteProduct(Number(id));
            res.send('Producto eliminado correctamente.');

      } catch (error) {

            // Si ocurre un error, se muestra un mensaje en consola y se envía un mensaje de error al cliente.
            res.status(500).send({
                  status: 'error',
                  error: 'Error al ejecutar la consulta.'
            });

      };

});

export default router;