'use strict';

// Mock controller. Modify ASAP.
module.exports = function (){
  var userCtrl = {};

  var Promise = require('bluebird');

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
      var user = userCtrl.findOne(values);
      if (user) {
        Object.keys(newValues).forEach(function (attr) {
          user[attr] = newValues[attr];
        });
      }
      resolve(user);
    });
  };

  return userCtrl;
}();
