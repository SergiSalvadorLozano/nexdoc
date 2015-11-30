"use strict";


var constants = require('../config/constants.json')
  , permCfg = require('../config/permissions')
  ;

module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define("User", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING(constants.EMAIL_MAX_LENGTH),
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(constants.PASSWORD_HASH_MAX_LENGTH),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(constants.USER_NAME_MAX_LENGTH),
      allowNull: false
    },
    languageCode: {
      type: DataTypes.STRING(constants.LANGUAGE_CODE_MAX_LENGTH),
      allowNull: false,
      defaultValue: constants.LANGUAGE_CODE_DEFAULT
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: permCfg.roles['user']
    }
  }, {
    //tableName: 'User',
    timestamps: false,
    freezeTableName: true,
    classMethods: {
      associate: function (models) {
        User.hasMany(models.Session, {foreignKey: 'userId'});
      }
    }
  });

  return User;
};
