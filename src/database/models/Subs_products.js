module.exports = (sequelize, DataTypes) => {
  let alias = "Subs_products";
  let columns = {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    prod_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    oe_number: {
      type: DataTypes.STRING,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false 
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false 
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true 
    },
  };
  
  let configurations = {};
  
  const Subs_products = sequelize.define(alias, columns, configurations);
  
  Subs_products.associate = (models) => {
    Subs_products.belongsTo(models.Product, {
      as: "product",
      foreignKey: "prod_id",
    });
  };
  
  return Subs_products;
};

  