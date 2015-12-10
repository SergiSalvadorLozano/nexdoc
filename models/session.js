"use strict";


var constants = require('../config/constants.json')
  , commonHlp = require('../helpers/common')
  ;

module.exports = function (sequelize, DataTypes) {
  var Session = sequelize.define("Session", {
    refreshToken: {
      type: DataTypes.STRING(constants.REFRESH_TOKEN_LENGTH),
      unique: true,
      allowNull: false,
      defaultValue: commonHlp.generateString(constants.REFRESH_TOKEN_LENGTH)
    },
    accessToken: {
      type: DataTypes.STRING(constants.ACCESS_TOKEN_LENGTH),
      unique: true,
      allowNull: false,
      defaultValue: commonHlp.generateString(constants.ACCESS_TOKEN_LENGTH)
    },
    refreshExpiryDate: {
      type: DataTypes.DATE,
      defaultValue: commonHlp.later(constants.REFRESH_TOKEN_VALIDITY)
    },
    accessExpiryDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: commonHlp.later(constants.ACCESS_TOKEN_VALIDITY)
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
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
