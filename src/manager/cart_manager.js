// Se importa el módulo fs para poder leer y escribir archivos.
import fs, {
      existsSync
} from 'fs';

// Se crea la clase CartManager.
class CartManager {

      // Se crea un constructor para inicializar el array del carrito y el path del archivo JSON.
      constructor() {

            this.carts = [];
            this.path = './data/carts.json';

      }

      // Se crea el método createCart para crear un nuevo carrito.
      createCart = async () => {

            // Se intenta ejecutar la consulta.
            try {

                  const newCart = {
                        id: this.carts.length + 1,
                        products: []
                  };

                  this.carts.push(newCart);

                  await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, '\t'), 'utf-8');

            } catch (error) {

                  // Si hubo un error al ejecutar la consulta, se envía un mensaje de error.
                  console.log('Error al ejecutar el método createCart:', error);
                  throw error;

            };

      };

      // Se crea el método getCart para obtener el carrito por su id.
      getCartById = async (id) => {

            // Se intenta ejecutar la consulta.
            try {

                  // Se verifica si existe el archivo JSON.
                  if (fs.existsSync(this.path)) {

                        const cartData = await fs.promises.readFile(this.path, 'utf-8');
                        this.cart = JSON.parse(cartData);
                        const cart = this.cart.find((cart) => cart.id === id);

                        // Se verifica si existe el carrito.
                        if (!cart) return console.log(`El id: ${id} ingresado, no pertenece a ningún producto.`);

                        // Si existe el carrito, se retorna el array de productos dentro del carrito.
                        return cart.products;

                  }

            } catch (error) {

                  // Si hubo un error al ejecutar la consulta, se envía un mensaje de error.
                  console.log(`Error al ejecutar la consulta: ${error}`);

            };

      };

      // Se crea el método addToCart para agregar el id del producto al carrito, utilizando los productos creados en products.json.
      addToCart = async (cartId, prodId) => {

            // Se intenta ejecutar la consulta.
            try {

                  // Se verifica que exista el archivo JSON de productos.
                  if (!fs.existsSync('../data/products.json')) return console.log('No existe ningún producto creado.');

                  // Se verifica que exista el archivo JSON de carritos.
                  if (!fs.existsSync(this.path)) return console.log('No existe ningún carrito creado.');

                  // Se obtiene el array de productos del carrito.
                  const cartData = await fs.promises.readFile(this.path, 'utf-8');
                  this.cart = JSON.parse(cartData);

                  // Se busca el carrito por su id.
                  const cart = this.cart.find((cart) => cart.id === cartId);

                  // Se verifica si existe el carrito.
                  if (!cart) return null;

                  // Se verifica si existe el producto.
                  const productData = await fs.promises.readFile('../data/products.json', 'utf-8');
                  const products = JSON.parse(productData);
                  const product = products.find((product) => product.id === prodId);

                  if (!product) return null;

                  // Se verifica si el producto ya existe en el carrito.
                  const existingProduct = cart.products.find((item) => item.product === prodId);

                  if (existingProduct) {

                        // Si el producto ya existe en el carrito, se agrega otra unidad del mismo.
                        existingProduct.quantity += 1;

                  } else {

                        // Si el producto no existe, se agrega al array de productos del carrito.
                        const newProduct = {
                              product: prodId,
                              quantity: 1
                        };

                        cart.products.push(newProduct);

                  };

                  // Se escribe el archivo JSON con el nuevo producto agregado.
                  await fs.promises.writeFile(this.path, JSON.stringify(this.cart, null, '\t'), 'utf-8');

                  console.log("Producto agregado al carrito.");

            } catch (error) {

                  // Si hubo un error al ejecutar la consulta, se envía un mensaje de error.
                  console.log('Error al ejecutar el método addToCart:', error);
                  throw error;

            };

      };

};

// Se exporta la clase ProductManager.
export default CartManager;