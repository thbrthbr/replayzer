const { DataTypes } = require('sequelize');

const List = (sequelize) => {
  const List = sequelize.define('list', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    fileName: {
      type: DataTypes.STRING(400),
      allowNull: false,
    },
  });
  return List;
};

module.exports = List;
