module.exports = (sequelize, dataTypes) => {
    let alias = "Message";
    let columns = {
      id: {
        type: dataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      allowNull: false 
    },
      date: {
          type: dataTypes.DATE,
          defaultValue: dataTypes.NOW,
        allowNull: false 
      },
      sender: {
        type: dataTypes.STRING(200),
        allowNull: false 
      },
      userId: {
        type: dataTypes.INTEGER(11),
        allowNull: false,
      },
      response: {
        type: dataTypes.STRING(255),
        allowNull: true 
      },
      message: {
        type: dataTypes.STRING(200),
        allowNull: false 
      },
      createdAt: {
        type: dataTypes.DATE,
        allowNull: false 
      },
      updatedAt: {
        type: dataTypes.DATE,
        allowNull: false 
      },
    };

    let configurations = {};
    const Message = sequelize.define(alias, columns, configurations);
    
    Message.associate = (models) => {
      Message.User = Message.belongsTo(models.User, {
        as: "user",
        foreignKey: "userId",
      });
    };
    return Message;
  };