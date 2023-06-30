module.exports = (sequelize, dataTypes) => {
  let alias = "Product";
let columns = {
  id: {
    type: dataTypes.INTEGER(11),
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  code: {
    type: dataTypes.STRING(50),
    allowNull: true,
  },
  name: {
    type: dataTypes.STRING(100),
    allowNull: false,
  },
  marca: {
    type: dataTypes.STRING(100),
    allowNull: false,
  },
  img: {
    type: dataTypes.STRING(100),
    allowNull: true,
  },
  price: {
    type: dataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  price_update: {
    type: dataTypes.DATE,
    allowNull: true,
  },
  stock: {
    type: dataTypes.DECIMAL(11, 2),
    allowNull: false,
  },
  description: {
    type: dataTypes.TEXT,
    allowNull: true,
  },
  engine: {
    type: dataTypes.STRING(100),
    allowNull: true,
  },
  oe_number: {
    type: dataTypes.STRING(50),
    allowNull: true,
  },
  specification: {
    type: dataTypes.JSON,
    allowNull: true,
  },
  marked: {
    type: dataTypes.BOOLEAN,
    defaultValue: false,
  },
};

let configurations = {};

const Product = sequelize.define(alias, columns, configurations);

return Product;
};
