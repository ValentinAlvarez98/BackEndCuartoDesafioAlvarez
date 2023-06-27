const socket = io.connect();

// Se escucha el evento updateProducts.
socket.on('updateProducts', (products) => {
      // Se obtiene el contenedor de productos.
      const productList = document.getElementById('product-list');

      // Se limpia el contenedor de productos.
      productList.innerHTML = '';

      // Se recorren los productos y se agregan al contenedor.
      products.forEach((product) => {
            const productItem = document.createElement('div');
            productItem.innerHTML = `
      <h2>${product.title}</h2>
      <p>Price: ${product.price}</p>
      <p>Description: ${product.description}</p>
    `;
            productList.appendChild(productItem);
      });
});