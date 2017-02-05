module.exports = function (sequelize, DataTypes) {

  var Session = sequelize.define('Session', {
    userId: DataTypes.STRING,
    token: DataTypes.STRING,
    confirmed: DataTypes.BOOLEAN
  });

  return Session;
};
