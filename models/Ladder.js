const { DataTypes, BOOLEAN } = require('sequelize');

const Ladder = (sequelize) => {
  const Ladder = sequelize.define('ladder', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    user: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    score: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  });
  return Ladder;
};

module.exports = Ladder;
