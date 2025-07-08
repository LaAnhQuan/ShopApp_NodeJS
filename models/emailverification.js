'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EmailVerification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  EmailVerification.init({
    email: DataTypes.STRING,
    name: DataTypes.STRING,
    password_hash: DataTypes.TEXT,
    otp: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'EmailVerification',
    tableName: 'email_verifications',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return EmailVerification;
};