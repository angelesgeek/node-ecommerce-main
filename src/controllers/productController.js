const db = require("../database/models");

const controller = {
  index: async function (req, res) {
    // Obtener todos los productos desde la base de datos
    let products = await getProducts();

    // Ordenar alfabéticamente
    products.sort((a, b) => a.name.localeCompare(b.name));

    // Número de productos por página
    const productosPorPagina = 12;

    // Página deseada
    const paginaDeseada = req.query.page ? parseInt(req.query.page) : 1;

    // Cálculo de los índices de los productos en la página deseada
    const inicio = (paginaDeseada - 1) * productosPorPagina;
    const fin = inicio + productosPorPagina;

    // Obtener los productos de la página deseada
    const productosPagina = products.slice(inicio, fin);

    // Calcular el número total de páginas
    const totalPages = Math.ceil(products.length / productosPorPagina);

    // Cálculo del rango de páginas a mostrar en la paginación
    const range = 3; // Número de páginas antes y después de la página actual a mostrar
    const startPage = Math.max(1, paginaDeseada - range);
    const endPage = Math.min(totalPages, paginaDeseada + range);
    const pageRange = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

    return res.render("products/list", {
      products: productosPagina,
      userLogged: req.session.userLogged,
      currentPage: paginaDeseada,
      totalPages: totalPages,
      pageRange: pageRange,
      isHomePage: false,
    });
  },


  detail: async function (req, res) {
    let products = await getProducts();
    let product = await db.Product.findByPk(req.params.id);

    // Obtener productos relacionados por nombre
    const relatedProducts = products.filter(
      (relatedProduct) =>
        relatedProduct.name !== product.name && relatedProduct.id !== product.id
    );

    // Limitar la cantidad de productos relacionados que se mostrarán
    const maxRelatedProducts = 3;
    const relatedProductsToShow = relatedProducts.slice(0, maxRelatedProducts);

    // Pasar los productos relacionados a la vista
    return res.render("products/detail", {
      product,
      relatedProducts: relatedProductsToShow,
      userLogged: req.session.userLogged,
    });
  },

  create: function (req, res) {
    return res.render("products/create", { userLogged: req.session.userLogged });
  },

  store: async function (req, res) {
    let image = "";
    if (req.file) {
      image = req.file.filename;
    }

    // Guardar el nuevo producto en la base de datos
    await db.Product.create({
      name: req.body.name,
      price: req.body.price,
      img: image,
      marked: req.body.marked ? true : false,
    });

    // Redireccionar al listado de productos
    return res.redirect("/products");
  },

  edit: async function (req, res) {
    let product = await db.Product.findByPk(req.params.id);
    if (product) {
      return res.render("products/edit", {
        product,
        userLogged: req.session.userLogged,
      });
    }
    return res.redirect("/products");
  },

  update: async function (req, res) {
    let product = await db.Product.findByPk(req.params.id);
    if (product) {
      let image = product.img;
      if (req.file) {
        image = req.file.filename;
      }
      await product.update({
        code: req.body.code,
        name: req.body.name,
        brand: req.body.brand,
        automotive: req.body.automotive,
        engine: req.body.engine,
        motor: req.body.motor,
        model: req.body.model,
        oe_number: req.body.oe_number,
        stock: req.body.stock,
        description: req.body.description,
        specification: req.body.specification,
        price: req.body.price,
        price_update: req.body.price_update,
        img: image,
        marked: req.body.marked ? true : false,
      });
    }
    return res.redirect("/products");
  },




  delete: async function (req, res) {
    const productId = req.params.id;

    try {
      // Eliminar las filas relacionadas en la tabla OrderItem primero
      await db.OrderItem.destroy({
        where: { productId: productId },
      });

      // Luego eliminar el producto
      await db.Product.destroy({
        where: { id: productId },
      });

      return res.redirect("/products");
    } catch (error) {
      // Manejar el error en caso de que algo falle
      console.error("Error al eliminar el producto:", error);
      return res.status(500).send("Error al eliminar el producto.");
    }
  },


  



  search: async function (req, res) {
    // Obtener los parámetros de búsqueda desde la URL
    const name = req.query.name;
    const brand = req.query.brand;
    const code = req.query.code;
    const description = req.query.description;
    const automotive = req.query.automotive;
    const engine = req.query.engine;

  
    // Realizar la búsqueda en la base de datos
    let products = await getProducts();
  
    // Filtrar los productos por nombre y marca
    if (name) {
      products = products.filter(product =>
        product.name.toLowerCase().includes(name.toLowerCase())
      );
    }
    if (code) {
      products = products.filter(product =>
        product.code.toLowerCase().includes(code.toLowerCase())
      );
    }
    if (description) {
      products = products.filter(product =>
        product.description.toLowerCase().includes(description.toLowerCase())
      );
    }
    // Renderizar la vista de resultados de búsqueda
    return res.render("products/test", {
      products,
      userLogged: req.session.userLogged,
    });
  },
  

};

// Función para obtener todos los productos desde la base de datos
async function getProducts() {
  return db.Product.findAll();
}

module.exports = controller;
