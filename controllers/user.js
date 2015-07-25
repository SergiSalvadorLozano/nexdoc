'use strict';

// Mock controller. Modify ASAP.
module.exports = function (){
  var userCtrl = {};

  var Promise = require('bluebird')
    , permCfg = require('../config/permissions')
    , comHlp = require('../helpers/common');

  var database = [
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
  ];


  userCtrl.findOne = function (values) {
    return new Promise (function (resolve, reject) {
      database.forEach(function (user) {
        var fulfills = true;
        Object.keys(values).forEach(function (attr) {
          if (user[attr] !== values[attr])
            fulfills = false;
        });
        if (fulfills)
          resolve(user);
      });
      resolve(null);
    });
  };


  userCtrl.updateOne = function (values, newValues) {
    return new Promise (function (resolve, reject) {
      for (var i = 0 ; i < database.length ; i += 1) {
        var fulfills = true;
        Object.keys(values).forEach(function (attr) {
          if (database[i][attr] !== values[attr])
            fulfills = false;
        });
        if (fulfills){
          Object.keys(newValues).forEach(function (attr) {
            database[i][attr] = newValues[attr];
          });
          resolve(database[i]);
          return;
        }
      }
      resolve(null);
    });
  };


  return userCtrl;
}();
