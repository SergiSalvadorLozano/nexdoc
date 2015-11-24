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
        password: '$2a$10$XqhRW/DiZLby9Q4WKIyup.80elqL1zeJ7sDUOL/PtUaKHqQrgyzfe', // 1234
        name: 'Alice',
        role: permCfg.roles['admin']
      },
      {
        id: 2,
        email: 'bob@example.com',
        password: '$2a$10$bs22jPViS6sVJ1DFmlq/SOOJBvTUOl1IRYGERlEWX2mesnX1Gpola', // 4321
        name: 'Bob',
        role: permCfg.roles['user']
      }
    ],
    Session: []
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


	ctrlHlp.createOne = function (modelName, newValues) {
		return new Promise (function (resolve, reject) {
			var newModel = {};
			Object.keys(newValues).forEach(function (column) {
				newModel[column] = newValues[column];
			});
			database[modelName].push(newModel);
			resolve(newModel);
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


  ctrlHlp.deleteOne = function (modelName, where) {
    return new Promise (function (resolve, reject) {
      for (var i = 0 ; i < database[modelName].length ; i += 1) {
        var fulfills = true;
        Object.keys(where).forEach(function (column) {
          if (database[modelName][i][column] !== where[column])
            fulfills = false;
        });
        if (fulfills)
          database[modelName].splice(i,1);
      }
      resolve(true);
    });
  };


  return ctrlHlp;
}();
