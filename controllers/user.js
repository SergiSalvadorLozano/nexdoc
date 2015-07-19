'use strict';

// Mock controller. Modify ASAP.
module.exports = function (){
  var userCtrl = {};

  var Promise = require('bluebird')
    , comHlp = require('../helpers/common');

  var database = [
    {
      id: 0,
      username: 'Alice',
      password: '1234',
      permissions: JSON.stringify(['p1']),
      idToken: 'lol',
      idTokenExpiry: null
    },
    {
      id: 1,
      username: 'Bob',
      password: '4321',
      permissions: JSON.stringify(['p1','p2']),
      idToken: 'abcd',
      idTokenExpiry: null
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


  userCtrl.refreshIdToken = function (userId, permanence) {
    var expiry = permanence ? null : comHlp.soon(30);
    userCtrl.updateOne({id: userId}, {idTokenExpiry: expiry});
  };


  return userCtrl;
}();
