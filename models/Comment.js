const { DataTypes } = require('sequelize');

const Comment = (sequelize) => {
  const Comment = sequelize.define('comment', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    pageid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nick: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    pw: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING(2000),
      allowNull: false,
    },
  });
  return Comment;
};

module.exports = Comment;
