const db = require("../database/models");
const Sequelize = require('sequelize');

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
    try {
        let product = await db.Product.findByPk(req.params.id);

        if (!product) {
            return res.status(404).send("Producto no encontrado");
        }

        // Buscar los productos sustitutos en la tabla subs_products
        const subsProducts = await db.Subs_products.findAll({
            where: { prod_id: req.params.id },
        });

        // Obtener los números de OE de los productos sustitutos
        const substituteOEList = subsProducts.map(subsProduct => subsProduct.oe_number);
        console.log(substituteOEList);
        return res.render("products/detail", {
          product,
          substituteOEList,
          subsProducts,
          userLogged: req.session.userLogged,
        });
    } catch (err) {
        console.error("Error al obtener el producto:", err);
        return res.status(500).send("Error al obtener el producto");
    }
},

  create: function (req, res) {
    return res.render("products/create", { userLogged: req.session.userLogged });
  },

  store: async function (req, res) {
    let image = "";
    if (req.file) {
      image = req.file.filename;
    }
  
    try {
      // Obtener la fecha de actualización de precios desde la vista
      const priceUpdate = req.body.priceUpdate || null;
  
      // Crear el nuevo producto en la tabla products
      const newProduct = await db.Product.create({
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
        price_update: priceUpdate,
        img: image,
        marked: req.body.marked ? true : false,
      });
  
      // Obtener los números de OE de los productos sustitutos desde el formulario
    const substituteOEList = req.body.substituteProducts.split(',').map(oe => oe.trim());

    // Usar Promise.all para realizar las operaciones de todos los productos sustitutos
    await Promise.all(substituteOEList.map(async (oeNumber) => {
      const product = await db.Product.findOne({ where: { oe_number: oeNumber } });
      if (product) {
        // Crear el registro en la tabla subs_products
        await db.Subs_products.create({
          prod_id: newProduct.id,
          oe_number: oeNumber,
          name: product.name,
          brand: product.brand,
          automotive: product.automotive,
          img: product.img,
          engine: product.engine,
          model: product.model,
        });
      }
    }));
  
      // Redireccionar al listado de productos
      return res.redirect("/products");
    } catch (error) {
      console.error("Error al guardar el producto:", error);
      return res.status(500).send("Error al guardar el producto");
    }
  },

  edit: async function (req, res) {
    try {
      let product = await db.Product.findByPk(req.params.id);
      
      if (!product) {
        return res.status(404).send("Producto no encontrado");
      }
  
      
      const subsProducts = await db.Subs_products.findAll({
        where: { prod_id: req.params.id },
      });
  
      
      const substituteOEList = subsProducts.map(subsProduct => subsProduct.oe_number);
  
      return res.render("products/edit", {
        product,
        substituteOEList,
        userLogged: req.session.userLogged,
      });
    } catch (err) {
      console.error("Error al obtener el producto:", err);
      return res.status(500).send("Error al obtener el producto");
    }
  },

  update: async function (req, res) {
    try {
      const productId = req.params.id;
      const substituteOEList = req.body.substituteProducts.split(',').map(oe => oe.trim());
      let imgPath = '';

      if (req.file) {
        imgPath = req.file.path; // Ruta de la nueva imagen
      }

      // Actualiza la imagen solo si se ha subido una nueva
    if (imgPath !== '') {
      // Realiza la lógica para guardar la nueva ruta de la imagen en la base de datos
      await db.Product.update({ img: imgPath }, { where: { id: productId } });
    }
      
      await db.Subs_products.destroy({ where: { prod_id: productId } });
  
      
      for (const oeNumber of substituteOEList) {
        const substituteProduct = await db.Product.findOne({ where: { oe_number: oeNumber } });
        if (substituteProduct) {
          await db.Subs_products.create({
            prod_id: productId,
            oe_number: oeNumber,
            name: substituteProduct.name,
            brand: substituteProduct.brand,
            automotive: substituteProduct.automotive,
            img: substituteProduct.img,
            engine: substituteProduct.engine,
            model: substituteProduct.model,
          });
        }
      }

  
  
      return res.redirect("/products/edit/" + productId + "?success=Producto editado exitosamente");
    } catch (err) {
      console.error("Error al actualizar el producto:", err);
      return res.status(500).send("Error al actualizar el producto");
    }
  },
  
  

  delete: async function (req, res) {
    const productId = req.params.id;
  
    try {
      // Deshabilitar restricciones de clave externa
      await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
  
      // Eliminar las filas relacionadas en la tabla 'subs_products' primero
      await db.Subs_products.destroy({
        where: { prod_id: productId },
      });
  
      // Luego eliminar el producto
      await db.Product.destroy({
        where: { id: productId },
      });
  
      // Habilitar restricciones de clave externa
      await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
  
      // Enviar respuesta de éxito
      return res.redirect("/products?success=Producto eliminado exitosamente");
     

    } catch (error) {
      // Manejar el error en caso de que algo falle
      console.error("Error al eliminar el producto:", error);
  
      // Enviar respuesta de error
      return res.status(500).send("Error al eliminar el producto");
    }
  },

  searchProducts: async function (req, res) {
    
    // Obtener los parámetros de búsqueda desde la URL
    const name = req.query.name;
    const brand = req.query.brand;
    const code = req.query.code;
    const description = req.query.description;
    const automotive = req.query.automotive;
    const engine = req.query.engine;

    // Definir un objeto vacío para las condiciones de búsqueda
    const searchConditions = {};

    // Verificar si cada campo tiene un valor y agregarlo a las condiciones de búsqueda
    if (name) {
      searchConditions.name = { [Sequelize.Op.like]: `%${name}%` };
    }
    if (brand) {
      searchConditions.brand = { [Sequelize.Op.like]: `%${brand}%` };
    }
    if (code) {
      searchConditions.code = { [Sequelize.Op.like]: `%${code}%` };
    }
    if (description) {
      searchConditions.description = { [Sequelize.Op.like]: `%${description}%` };
    }
    if (automotive) {
      searchConditions.automotive = { [Sequelize.Op.like]: `%${automotive}%` };
    }
    if (engine) {
      searchConditions.engine = { [Sequelize.Op.like]: `%${engine}%` };
    }

    try {

      // Realizar la búsqueda en la base de datos usando Sequelize con las condiciones de búsqueda
      const products = await db.Product.findAll({
        where: searchConditions, // Aquí especificamos las condiciones de búsqueda
      });

      // Renderizar la vista de resultados de búsqueda
      return res.render("products/test", {
        products,
        userLogged: req.session.userLogged,
      });
    } catch (error) {
      
      return res.render("errors/404", { "userLogged": req.session.userLogged });
    }
  },

};

// Función para obtener todos los productos desde la base de datos
async function getProducts() {
  return db.Product.findAll();
}

module.exports = controller;
