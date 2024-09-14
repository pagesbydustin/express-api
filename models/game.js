module.exports = (sequelize, DataTypes) => {
  const Game = sequelize.define("Game", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    genre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    releaseDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    developer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  return Game;
};
