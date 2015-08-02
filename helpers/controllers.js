'use strict';


module.exports = function (){
  var ctrlHlp = {};

  var Promise = require('bluebird')
    , commonHlp = require('../helpers/common')
    , permCfg = require('../config/permissions');


  var database = {
    User: [
      {
        id: 1,
        email: 'alice@example.com',
        password: '1234',
        role: permCfg.roles['admin']
      },
      {
        id: 2,
        email: 'bob@example.com',
        password: '4321',
        role: permCfg.roles['user']
      }
    ],
    Session: [
      {
        id: 1,
        id_token: '46sad4fasdf6asd5fafas6df',
        user_id: 1,
        expiry_date: commonHlp.soon(30)
      }
    ]
  };


  ctrlHlp.findOne = function (modelName, where, include) {
    return new Promise (function (resolve, reject) {
      database[modelName].forEach(function (row) {
        var fulfills = true;
        Object.keys(where).forEach(function (column) {
          if (row[column] !== where[column])
            fulfills = false;
        });
        if (fulfills)
          resolve(row);
      });
      resolve(null);
    });
  };


  ctrlHlp.updateOne = function (model, newValues) {
    return new Promise (function (resolve, reject) {
      Object.keys(newValues).forEach(function (column) {
        model[column] = newValues[column];
      });
      resolve(model);
    });
  };


  ctrlHlp.updateAll = function (modelName, where, newValues) {
    return new Promise (function (resolve, reject) {
      var numRows = 0;
      for (var i = 0 ; i < database[modelName].length ; i += 1) {
        var fulfills = true;
        Object.keys(where).forEach(function (column) {
          if (database[modelName][i][column] !== where[column])
            fulfills = false;
        });
        if (fulfills){
          Object.keys(newValues).forEach(function (column) {
            database[modelName][i][column] = newValues[column];
          });
          numRows += 1;
        }
      }
      resolve(numRows);
    });
  };


  return ctrlHlp;
}();
