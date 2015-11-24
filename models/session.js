"use strict";


var constants = require('../config/constants.json');

module.exports = function (sequelize, DataTypes) {
  var Session = sequelize.define("Session", {
    refreshToken: {
      type: DataTypes.STRING(constants.REFRESH_TOKEN_LENGTH),
      unique: true,
      allowNull: false
    },
    accessToken: {
      type: DataTypes.STRING(constants.ACCESS_TOKEN_LENGTH),
      unique: true,
      allowNull: false
    },
    refreshExpiryDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    accessExpiryDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER
    },
    languageCode: {
      type: DataTypes.STRING(constants.LANGUAGE_CODE_MAX_LENGTH)
    }
  }, {
    //tableName: 'Session',
    timestamps: false,
    freezeTableName: true,
    classMethods: {
      associate: function (models) {
        Session.belongsTo(models.User, {foreignKey: 'userId',
          onDelete: 'cascade'});
      }
    }
  });

  return Session;
};
