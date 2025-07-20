'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Order, {
        foreignKey: 'user_id',
      })
      User.hasMany(models.Feedback, {
        foreignKey: 'user_id',
      })
      User.hasMany(models.Message, {
        foreignKey: 'sender_id',
        as: 'SentMessages',
      });
      User.hasMany(models.Message, {
        foreignKey: 'receiver_id',
        as: 'ReceivedMessages',
      });

    }
  }
  User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    role: DataTypes.INTEGER,
    avatar: DataTypes.STRING,
    phone: DataTypes.STRING,
    is_verified: DataTypes.BOOLEAN,
    is_locked: DataTypes.INTEGER,
    password_changed_at: DataTypes.DATE,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return User;
};