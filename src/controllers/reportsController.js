const db = require("../database/models");
const Sequelize = require("sequelize");
const fs = require("fs");
const PDFDocument = require("pdfkit");

const getOrdersPerMonth = async () => {
  try {
    const orderCounts = await db.Order.findAll({
      attributes: [
        [db.sequelize.fn('YEAR', db.sequelize.col('createdAt')), 'year'],
        [db.sequelize.fn('MONTH', db.sequelize.col('createdAt')), 'month'],
        [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'orderCount']
      ],
      group: ['year', 'month'],
      raw: true,
      order: [db.sequelize.literal('year, month')]
    });

    return orderCounts;
  } catch (error) {
    throw error;
  }
};

const getOrdersPerWeek = async () => {
  try {
    const orderCounts = await db.Order.findAll({
      attributes: [
        [db.sequelize.fn('YEAR', db.sequelize.col('createdAt')), 'year'],
        [db.sequelize.fn('WEEK', db.sequelize.col('createdAt')), 'week'],
        [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'orderCount']
      ],
      group: ['year', 'week'],
      raw: true,
      order: [db.sequelize.literal('year, week')]
    });

    return orderCounts;
  } catch (error) {
    throw error;
  }
};

const renderReports = async (req, res) => {
  try {

    // Consulta para obtener la cantidad total de productos
    const totalProducts = await db.Product.count();

    // Consulta para obtener la cantidad de productos en pedidos
    const productsInOrders = await db.OrderItem.count({
      distinct: true,
      col: 'productId'
    });

    // Calcular el porcentaje de productos en pedidos
    const productsInOrdersPercentage = (productsInOrders / totalProducts) * 100;

    // Consulta para obtener la cantidad total de pedidos
    const totalOrders = await db.Order.count();

    // Consulta para obtener el total en dinero de los pedidos
    const totalOrdersMoney = await db.Order.sum("total");

    // Consulta para obtener la cantidad de usuarios con rol 0
    const totalUsersWithRole0 = await db.User.count({
      where: {
        rol: 0
      }
    });

    // Consulta para obtener el ranking de clientes según la cantidad de pedidos
    const customerRanking = await db.Order.findAll({
      attributes: ['id_app', [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'orderCount']],
      group: ['id_app'],
      order: db.sequelize.literal('orderCount DESC'),
      limit: 10 // Puedes ajustar la cantidad de clientes en el ranking que deseas mostrar
    });

    // Consulta para obtener la cantidad de pedidos con order_status = 2
    const ordersWithStatus2 = await db.Order.count({
      where: {
        order_status: 2
      }
    });

    // Calcular el porcentaje de pedidos con order_status = 2 en relación con el total de pedidos
    const ordersWithStatus2Percentage = (ordersWithStatus2 / totalOrders) * 100;
    
    // Consulta para obtener el total de pedidos por mes
    const orderCountsPerMonth = await getOrdersPerMonth();

    // Calcular el total por mes
    var totalPerMonth = 0;
    orderCountsPerMonth.forEach(function(entry) {
      totalPerMonth += entry.orderCount;
    });

    // Consulta para obtener el total de pedidos por semana
    const orderCountsPerWeek = await getOrdersPerWeek();

    // Calcular el total por semana
    var totalPerWeek = 0;
    orderCountsPerWeek.forEach(function(entry) {
      totalPerWeek += entry.orderCount;
    });

    return res.render("reports", { 
      userLogged: req.session.userLogged, 
      totalOrders,
      totalOrdersMoney,
      totalUsersWithRole0,
      customerRanking,
      orderCountsPerMonth,
      totalPerMonth,
      orderCountsPerWeek,
      totalPerWeek,
      totalProducts,
      productsInOrders,
      productsInOrdersPercentage,
      ordersWithStatus2,
      ordersWithStatus2Percentage
    });

  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).send("Error fetching data");
  }
};

module.exports = {
  renderReports
};