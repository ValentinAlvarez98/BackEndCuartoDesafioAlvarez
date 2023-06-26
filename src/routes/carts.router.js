// Se importa el módulo express y se crea el router.
import express from 'express';
const router = express.Router();

// Se importa la clase CartManager.
import CartManager from '../manager/cart_manager.js';

// Se crea una instancia de la clase CartManager.
const cartManager = new CartManager();

// Se crea un endpoint POST para crear un nuevo carrito.
router.post('/', async (req, res) => {

      // Se intenta ejecutar la consulta.
      try {

            // Se crea el carrito utilizando el método createCart de la clase CartManager.
            const cart = await cartManager.createCart();

            // Se envía el carrito.
            res.send(cart);

      } catch (error) {

            // Si hubo un error al ejecutar la consulta, se envía un mensaje de error.
            res.status(500).send({
                  status: "error",
                  error: "Error al ejecutar la consulta."
            });

      };

});

// Se crea un endpoint GET para obtener todos los productos de un carrito por su id.
router.get('/:cid', async (req, res) => {

      // Se obtiene el id del carrito.
      const id = req.params.cid;

      // Se intenta ejecutar la consulta.
      try {

            // Se obtienen los productos del carrito utilizando el método getCartById de la clase CartManager.
            const cart = await cartManager.getCartById(Number(id));

            // Si no se encontró el carrito, se envía un mensaje de error.
            if (!cart)
                  return res.status(404).send({
                        status: "error",
                        error: `No se ha podido encontrar el carrito con el id: ${Number(id)}`
                  });

            // Si se encontró el carrito, se envía el carrito.
            res.send(cart);

      } catch (error) {

            // Si hubo un error al ejecutar la consulta, se envía un mensaje de error.
            res.status(500).send({
                  status: "error",
                  error: "Error al ejecutar la consulta."
            });

      };

});

// Se crea un endpoint POST para agregar un producto a un carrito.
router.post('/:cid/product/:pid', async (req, res) => {

      // Se obtiene el id del carrito.
      const cartId = req.params.cid;

      // Se obtiene el id del producto.
      const productId = req.params.pid;

      // Se intenta ejecutar la consulta.
      try {

            // Se agrega el producto al carrito utilizando el método addToCart de la clase CartManager.
            const cart = await cartManager.addToCart(Number(cartId), Number(productId));

            // Si no se encontró el carrito o el producto, se envía un mensaje de error.
            if (cart === null) {

                  return res.status(404).send({
                        status: "error",
                        error: `No se ha podido encontrar el carrito con el id: ${Number(cartId)} o el producto con el id: ${Number(productId)}`
                  });

            };

            // Si se encontró el carrito y el producto, se envía el carrito.
            res.status(201).send({
                  status: "success",
                  message: "Producto agregado al carrito.",
                  cart
            });

      } catch (error) {

            // Si hubo un error al ejecutar la consulta, se envía un mensaje de error.
            res.status(500).send({
                  status: "error",
                  error: "Error al ejecutar la consulta."
            });

      };

});

// Se exporta el router.
export default router;