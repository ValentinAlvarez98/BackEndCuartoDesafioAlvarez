import fs from 'fs';

// Se crea la clase CartManager.
class CartManager {

      // Se define el constructor de la clase.
      constructor() {
            this.path = './data/carts.json';
            this.loadCarts();
      }

      // Se crea el método loadCarts, que carga los carritos desde el archivo JSON.
      loadCarts = async () => {

            // Se intenta cargar los carritos.
            try {

                  // Si el archivo existe, se cargan los carritos.
                  if (fs.existsSync(this.path)) {

                        const cartData = await fs.promises.readFile(this.path, 'utf-8');
                        this.carts = JSON.parse(cartData);

                  } else {
                        this.carts = [];
                  };

            } catch (error) {

                  // Si ocurre un error, se muestra un mensaje en consola y se lanza el error.
                  console.log(`Error al cargar los carritos: ${error}`);
                  throw error;

            };

      };

      // Se crea el método createCart, que crea un nuevo carrito.
      createCart = async () => {

            // Se intenta ejecutar la consulta.
            try {

                  // Se crea el carrito.
                  const newCart = {
                        id: this.carts.length + 1,
                        products: []
                  };

                  // Se agrega el carrito a la lista de carritos.
                  this.carts.push(newCart);

                  // Se guarda el carrito.
                  await fs.promises.writeFile(
                        this.path,
                        JSON.stringify(this.carts, null, '\t'),
                        'utf-8'
                  );

            } catch (error) {

                  // Si ocurre un error, se muestra un mensaje en consola y se lanza el error.
                  console.log('Error al ejecutar el método createCart:', error);
                  throw error;

            };

      };


      // Se crea el método getCartById, que devuelve un carrito por su id.
      getCartById = async (id) => {

            // Se intenta ejecutar la consulta.
            try {

                  // Se valida que el id corresponda a un carrito.
                  const cart = this.carts.find((cart) => cart.id === id);

                  // Si no se encontró el carrito, se muestra un mensaje en consola y se devuelve undefined.
                  if (!cart) {
                        console.log(`El id: ${id} ingresado, no pertenece a ningún carrito.`);
                        return;
                  };

                  return cart.products;

            } catch (error) {

                  // Si ocurre un error, se muestra un mensaje en consola y se lanza el error.
                  console.log(`Error al ejecutar la consulta: ${error}`);
                  throw error;

            };

      };


      // Se crea el método addToCart, que agrega un producto a un carrito, según sus ids.
      addToCart = async (cartId, prodId) => {

            // Se intenta ejecutar la consulta.
            try {

                  // Se validan los ids.
                  if (!cartId || !prodId) {
                        console.log("Debe ingresar un id de carrito y un id de producto.");
                        return;
                  };

                  // Se busca el carrito.
                  const cart = this.carts.find((cart) => cart.id === cartId);

                  // Si no se encontró el carrito, se muestra un mensaje en consola y se devuelve undefined.
                  if (!cart) {

                        console.log(`No se encontró el carrito con el id: ${cartId}`);
                        return;

                  };

                  // Se busca el producto.
                  const product = await this.getProductById(prodId);

                  // Si no se encontró el producto, se muestra un mensaje en consola y se devuelve undefined.
                  if (!product) {

                        console.log(`No se encontró el producto con el id: ${prodId}`);
                        return;

                  };

                  // Se agrega el producto al carrito.
                  const existingProduct = cart.products.find(
                        (item) => item.product === prodId
                  );

                  if (existingProduct) {

                        existingProduct.quantity += 1;

                  } else {

                        const newProduct = {
                              product: prodId,
                              quantity: 1
                        };

                        cart.products.push(newProduct);

                  };

                  await fs.promises.writeFile(
                        this.path,
                        JSON.stringify(this.carts, null, '\t'),
                        'utf-8'
                  );

                  console.log("Producto agregado al carrito.");

            } catch (error) {

                  // Si ocurre un error, se muestra un mensaje en consola y se lanza el error.
                  console.log('Error al ejecutar el método addToCart:', error);
                  throw error;

            };

      };

};

export default CartManager;