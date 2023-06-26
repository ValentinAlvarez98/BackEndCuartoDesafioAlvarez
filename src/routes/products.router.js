// Se importa el módulo express y se crea el router.
import express from 'express';
const router = express.Router();

// Se importa la clase ProductManager.
import ProductManager from '../manager/product_manager.js';

// Se crea una instancia de la clase ProductManager.
const productManager = new ProductManager();

// Se crea el endpoint para obtener todos los productos o una catidad limitada de productos.
router.get('/', async (req, res) => {

      // Se obtiene el límite de productos a mostrar.
      const limit = req.query.limit;

      // Se intenta ejecutar la consulta.
      try {

            // Se obtienen los productos utilizando el método getProducts de la clase ProductManager.
            const products = await productManager.getProducts();

            // Si no se especificó un límite, se envían todos los productos.
            if (!limit) return res.send(products);

            // Si se especificó un límite, se envían la cantidad de productos especificada.
            res.send(products.slice(0, limit));

      } catch (error) {

            // Si hubo un error al ejecutar la consulta, se envía un mensaje de error.
            res.status(500).send({
                  status: "error",
                  error: "Error al ejecutar la consulta."
            });

      };

});

// Se crea el endpoint para obtener un producto por su id.
router.get('/:productId', async (req, res) => {

      // Se obtiene el id del producto.
      const id = req.params.productId;

      // Se intenta ejecutar la consulta.
      try {

            // Se obtiene el producto utilizando el método getProductById de la clase ProductManager.
            const product = await productManager.getProductById(Number(id));

            // Si no se encontró el producto, se envía un mensaje de error.
            if (!product)
                  return res.status(404).send({
                        status: "error",
                        error: `No se ha podido encontrar el producto con el id: ${Number(id)}`
                  });

            // Si se encontró el producto, se envía el producto.
            res.send(product);

      } catch (error) {

            // Si hubo un error al ejecutar la consulta, se envía un mensaje de error.
            res.status(500).send({
                  status: "error",
                  error: "Error al ejecutar la consulta."
            });

      };

});

// Se crea un endpoint para crear un producto.
router.post('/', async (req, res) => {

      // Se obtiene el producto del body.
      const product = req.body;

      // Se intenta ejecutar la consulta.
      try {

            // Se agrega el producto utilizando el método addProduct de la clase ProductManager.
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

            // Si hubo un error al ejecutar la consulta, se envía un mensaje de error.
            res.status(500).send({
                  status: 'error',
                  error: 'Error al ejecutar la consulta.',
            });

      };

});

// Se crea un endpoint para actualizar un producto.
router.put('/:productId', async (req, res) => {

      // Se obtiene el id del producto.
      const id = req.params.productId;

      // Se obtiene el producto del body.
      const product = req.body;

      // Se intenta ejecutar la consulta.
      try {

            // Se actualiza el producto utilizando el método updateProduct de la clase ProductManager.
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

            // Si hubo un error al ejecutar la consulta, se envía un mensaje de error.
            res.status(500).send({
                  status: 'error',
                  error: 'Error al ejecutar la consulta.',
            });

      };

});

// Se crea un endpoint para eliminar un producto.
router.delete('/:productId', async (req, res) => {

      // Se obtiene el id del producto.
      const id = req.params.productId;

      // Se intenta ejecutar la consulta.
      try {

            // Se elimina el producto utilizando el método deleteProduct de la clase ProductManager.
            await productManager.deleteProduct(Number(id));

            res.send('Producto eliminado correctamente.');

      } catch (error) {

            // Si hubo un error al ejecutar la consulta, se envía un mensaje de error.
            res.status(500).send({
                  status: 'error',
                  error: 'Error al ejecutar la consulta.',
            });

      };

});

// Se exporta el router.
export default router;