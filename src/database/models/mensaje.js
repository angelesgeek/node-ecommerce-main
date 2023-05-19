module.exports = (sequelize, dataTypes) => {
    let alias = "Mensaje";
    let columns = {
      id: {
        type: dataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      allowNull: false 
    },
      fecha: {
          type: dataTypes.DATE,
          defaultValue: dataTypes.NOW,
        allowNull: false 
      },
      remitente: {
        type: dataTypes.STRING(200),
        allowNull: false 
      },
      respuesta: {
        type: dataTypes.STRING(255),
        allowNull: true 
      },
      mensaje: {
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
    const Mensaje = sequelize.define(alias, columns, configurations);
    
    Mensaje.associate = (models) => {
      Mensaje.User = Mensaje.belongsTo(models.User, {
        as: "user",
        foreignKey: "id",
      });
    };
    return Mensaje;
  };