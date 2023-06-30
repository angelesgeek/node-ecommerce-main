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
      }
    };
    
    let configurations = {};
    const Subs_products = sequelize.define(alias, columns, configurations);
    
    Subs_products.associate = (models) => {
      Subs_products.belongsTo(models.Product, {
        as: "product",
        foreignKey: "oe_number",
      });
    };
    
    return Subs_products;
  };
  