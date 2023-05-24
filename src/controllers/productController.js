const db = require("../database/models");

const controller = {
  index: async function (req, res) {
    // Obtener todos los productos desde la base de datos
    let products = await db.Product.findAll();

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
    const totalPages = Math.ceil(products.length / productosPorPagina)+1;

    return res.render("products/list", {
      products: productosPagina,
      user: req.session.userLogged,
      currentPage: paginaDeseada,
      totalPages: totalPages
    });
  },

    detail: async function (req, res) {
    let product = await db.Product.findByPk(req.params.id);
    console.log(product);
    return res.render("products/detail", { product, user: req.session.userLogged });
  },
  
  create: function (req, res) {
    return res.render("products/create", { "user": req.session.userLogged });
  },
  store: async function (req, res) {
    let image = "";
    if (req.file) {
      image = req.file.filename;
    }

    //guardo el nuevo producto con la estructura
    await db.Product.create({
      name: req.body.name,
      price: req.body.price,
      img: image,
      marked: req.body.marked ? true : false,
    });

    //redireccione al listado de productos
    return res.redirect("/products");
  },
  edit: async function (req, res) {
    let product = await db.Product.findByPk(req.params.id);
    if (product) {
      return res.render("products/edit", { product, "user": req.session.userLogged });
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
        name: req.body.name,
        price: req.body.price,
        img: image,
        marked: req.body.marked ? true : false,
      });
    }
    return res.redirect("/products");
  },
  delete: async function (req, res) {
    await db.Product.destroy({
      where: { id: req.params.id },
    });

    res.redirect("/products");
  },
};

module.exports = controller;
