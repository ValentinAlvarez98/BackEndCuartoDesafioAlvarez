import fs from 'fs';

import path from 'path';

// Se importa el socketServer.
import socketServer from '../app.js';

// Se crea la clase ProductManager.
class ProductManager {

      // Se define el constructor.
      constructor() {
            this.path = './data/products.json';
            this.products = [];
            this.loadProducts();

            // Se configura el watcher, que se encarga de detectar cambios en el archivo products.json.

            // Se obtiene el directorio y el nombre del archivo.
            const directory = path.dirname(this.path);
            const filename = path.basename(this.path);

            // Se crea el watcher, con fs.watch.
            fs.watch(directory, (eventType, changedFilename) => {

                  // Se valida que el evento sea change y que el archivo modificado sea products.json.
                  if (eventType === 'change' && changedFilename === filename) {

                        // Se cargan los productos y se emite el evento updateProducts.
                        this.loadProducts().then(() => {

                              socketServer.emit('updateProducts', this.products);

                        });

                  };

            });

      };

      // Se define el método loadProducts, que carga los productos desde el archivo JSON.
      loadProducts = async () => {

            // Se intenta cargar los productos.
            try {

                  // Si el archivo existe, se cargan los productos.
                  if (fs.existsSync(this.path)) {

                        // Se lee el archivo.
                        const productData = await fs.promises.readFile(this.path, 'utf-8');

                        // Se convierten los productos a JSON.
                        this.products = JSON.parse(productData);

                  } else {

                        this.products = [];

                  };

                  return this.products;

            } catch (error) {

                  // Si ocurre un error, se muestra un mensaje en consola y se lanza el error.
                  console.error('Error al cargar los productos:', error);
                  throw error;

            };

      };

      // Se define el método saveProducts, que guarda los productos en el archivo JSON.
      saveProducts = async () => {

            // Se intenta guardar los productos.
            try {

                  // Se convierten los productos a JSON.
                  const productData = JSON.stringify(this.products, null, 2);

                  // Se guardan los productos.
                  await fs.promises.writeFile(this.path, productData);

            } catch (error) {

                  // Si ocurre un error, se muestra un mensaje en consola y se lanza el error.
                  console.error('Error al guardar los productos:', error);
                  throw error;
            };

      };

      // Se define el método getProducts, que devuelve los productos.
      getProducts = async () => {

            // Se intenta obtener los productos.
            try {

                  // Se utiliza socket io para emitir el evento updateProducts.
                  socketServer.emit('updateProducts', this.products);

                  // Se cargan los productos.
                  await this.loadProducts();

                  // Se devuelven los productos.
                  return this.products;

            } catch (error) {

                  // Si ocurre un error, se muestra un mensaje en consola y se lanza el error.
                  console.error('Error al ejecutar el método getProducts:', error);
                  throw error;

            };

      };


      // Se define el método addProduct, que agrega un producto.
      addProduct = async (
            title,
            description,
            code,
            price,
            status = true,
            stock,
            category,
            thumbnails
      ) => {

            // Se intenta agregar el producto.
            try {

                  // Se crea el producto.
                  const newProduct = {
                        title,
                        description,
                        code,
                        price,
                        status,
                        stock,
                        category,
                        thumbnails,
                        id: Math.floor(Math.random() * 100) + 1,
                  };

                  // Se validan los campos del producto.
                  if (
                        !newProduct.title ||
                        !newProduct.description ||
                        !newProduct.code ||
                        !newProduct.price ||
                        !newProduct.status ||
                        !newProduct.stock ||
                        !newProduct.category
                  ) {
                        console.log('El producto ingresado no puede tener campos vacíos.');
                        return;
                  };

                  if (this.products.some((product) => product.code === code)) {
                        console.log(`El código: ${code} ingresado, ya pertenece a otro producto.`);
                        return;
                  };

                  if (
                        this.products.some((product) => product.id === newProduct.id)
                  ) {
                        newProduct.id = Math.floor(Math.random() * 100) + 1;
                  };

                  // Se agrega el producto.
                  this.products.push(newProduct);
                  await this.saveProducts();

                  console.log('Producto agregado correctamente.');

            } catch (error) {

                  // Si ocurre un error, se muestra un mensaje en consola y se lanza el error.
                  console.error('Error al ejecutar el método addProduct:', error);
                  throw error;

            };
      };


      // Se define el método getProductById, que devuelve un producto según su id.
      getProductById = async (id) => {

            // Se intenta obtener el producto.
            try {

                  // Se cargan los productos.
                  await this.loadProducts();
                  const product = this.products.find((product) => product.id === id);

                  // Se devuelve el producto, si existe.
                  if (product) {

                        return product;

                  } else {

                        console.log(`El id: ${id} ingresado, no pertenece a ningún producto.`);
                        return;

                  };

            } catch (error) {

                  // Si ocurre un error, se muestra un mensaje en consola y se lanza el error.
                  console.error('Error al ejecutar el método getProductById:', error);
                  throw error;

            };

      };

      // Se define el método updateProduct, que actualiza un producto.
      updateProduct = async (
            id,
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails
      ) => {

            // Se intenta actualizar el producto.
            try {

                  // Se cargan los productos.
                  await this.loadProducts();
                  const product = await this.getProductById(id);

                  // Se actualiza el producto, si existe.
                  if (product) {
                        const updatedProduct = {
                              ...product,
                              title: title || product.title,
                              description: description || product.description,
                              code: code || product.code,
                              price: price || product.price,
                              status: status || product.status,
                              stock: stock || product.stock,
                              category: category || product.category,
                              thumbnails: thumbnails || product.thumbnails,
                        };

                        if (
                              !updatedProduct.title ||
                              !updatedProduct.description ||
                              !updatedProduct.code ||
                              !updatedProduct.price ||
                              !updatedProduct.status ||
                              !updatedProduct.stock ||
                              !updatedProduct.category
                        ) {
                              console.log(
                                    'El producto actualizado no puede tener campos vacíos.'
                              );
                              return;
                        };

                        if (
                              updatedProduct.code !== product.code &&
                              this.products.some((product) => product.code === code)
                        ) {
                              console.log(`El código: ${code} ingresado, ya pertenece a otro producto.`);
                              return;
                        };

                        const productIndex = this.products.findIndex(
                              (product) => product.id === id
                        );

                        // Se actualiza el producto.
                        this.products[productIndex] = updatedProduct;
                        await this.saveProducts();

                        console.log('Producto actualizado correctamente.');

                  };

            } catch (error) {

                  // Si ocurre un error, se muestra un mensaje en consola y se lanza el error.
                  console.error('Error al ejecutar el método updateProduct:', error);
                  throw error;

            };

      };

      // Se define el método deleteProduct, que elimina un producto.
      deleteProduct = async (id) => {

            // Se intenta eliminar el producto.
            try {

                  // Se cargan los productos.
                  await this.loadProducts();
                  const productIndex = this.products.findIndex(
                        (product) => product.id === id
                  );

                  // Se elimina el producto, si existe.
                  if (productIndex !== -1) {

                        // Se elimina el producto.
                        this.products.splice(productIndex, 1);
                        await this.saveProducts();

                        console.log('Producto eliminado correctamente.');

                  } else {

                        console.log(`El id: ${id} ingresado, no pertenece a ningún producto.`);
                        return;

                  };

            } catch (error) {

                  // Si ocurre un error, se muestra un mensaje en consola y se lanza el error.
                  console.error('Error al ejecutar el método deleteProduct:', error);
                  throw error;

            };
      };

};

export default ProductManager;