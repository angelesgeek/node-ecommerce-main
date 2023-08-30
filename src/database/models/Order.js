module.exports = (sequelize, dataTypes) => {
  let alias = "Order";
  let columns = {
    id: {
      type: dataTypes.INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    id_app: {
      type: dataTypes.INTEGER(11),
      allowNull: true,
    },
    userId: {
      type: dataTypes.INTEGER(11),
      allowNull: false,
    },
    assignedTo: {
      type: dataTypes.STRING(50),
      allowNull: true,
    },
    code: {
      type: dataTypes.STRING(50),
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
    total: {
      type: dataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
   comments: {
      type: dataTypes.STRING(100),
      allowNull: true,
    },
    order_status: {
      type: dataTypes.INTEGER(2),
      defaultValue: 0,
      allowNull: false,
    },
    bill_type: {
      type: dataTypes.STRING(25),
      allowNull: false,
    },
    paymentMethod: {
      type: dataTypes.STRING(25),
      allowNull: false,
    },
    shippingMethod: {
      type: dataTypes.STRING(25),
      allowNull: true,
    },
  };
  let configurations = {};

  const Order = sequelize.define(alias, columns, configurations);

  Order.associate = (models) => {
    Order.User = Order.belongsTo(models.User, {
      as: "user",
      foreignKey: "userId",
    });
    
    Order.App = Order.belongsTo(models.User, {
      as: "app",
      foreignKey: "id_app",
    });

    Order.OrderItems = Order.hasMany(models.OrderItem, {
      as: "orderItems",
    });



  };

  return Order;
};
