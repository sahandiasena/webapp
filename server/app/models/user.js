module.exports = function (sequelize, DataTypes) {

  var User = sequelize.define('User', {
    userId: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1
    },
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    phone: DataTypes.INTEGER,
    countryCode: DataTypes.INTEGER,
    password: DataTypes.STRING,
    authyId: DataTypes.STRING,
    authyStatus: {
      type: DataTypes.STRING,
      defaultValue: 'unverified'
    }
  });

  return User;
};
