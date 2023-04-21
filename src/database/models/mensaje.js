module.exports = (sequelize, dataTypes) => {
    let alias = "Mensaje";
    let columns = {
      mensaje: {
        type: dataTypes.STRING(200),
        allowNull: false 
      },
    };

    let configurations = {};
    const Mensaje = sequelize.define(alias, columns, configurations);
    
    Mensaje.associate = (models) => {
      Mensaje.User = Mensaje.belongsTo(models.User, {
        as: "user",
        foreignKey: "userId",
      });
    };
    return Mensaje;
  };