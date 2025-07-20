'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserStatus extends Model {
    static associate(models) {
      UserStatus.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'User',
      });
    }
  }
  UserStatus.init({
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    is_online: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    last_seen: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'UserStatus',
    tableName: 'user_status',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return UserStatus;
};
