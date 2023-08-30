module.exports = (sequelize, DataTypes) => {
  let alias = "User";
  let columns = {
    id: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    id_app: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    rol: {
      type: DataTypes.INTEGER(2),
      defaultValue: 0,
    }, 
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    img: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  };
  let configurations = {};

  const User = sequelize.define(alias, columns, configurations);

  User.associate = (models) => {
    User.hasMany(models.Order, {
      as: "orders",
      foreignKey: "userId",
    });

    User.hasMany(models.Order, {
      as: "appOrders",
      foreignKey: "id_app",
    });
    
  };

  return User;
};
