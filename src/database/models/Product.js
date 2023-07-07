module.exports = (sequelize, DataTypes) => {
  let alias = "Product";
  let columns = {
    id: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    brand: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    automotive: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    img: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    price_update: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    stock: {
      type: DataTypes.DECIMAL(11, 2),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    engine: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    model: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    oe_number: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    specification: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    marked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  };
  
  let configurations = {};
  
  const Product = sequelize.define(alias, columns, configurations);
  
  Product.associate = (models) => {
    Product.hasMany(models.Subs_products, {
      as: "subsProducts",
      foreignKey: "prod_id",
    });
  };
  
  return Product;
};
