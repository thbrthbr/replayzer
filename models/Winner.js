const { DataTypes, BOOLEAN } = require('sequelize');

const Winner = (sequelize) => {
  const Winner = sequelize.define('winner', {
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
    filename: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    date: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    yearOwner: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
  });
  return Winner;
};

module.exports = Winner;
