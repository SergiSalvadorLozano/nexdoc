// Specific database functions for the current application.

module.exports = function () {
	var fs = require('fs');
	
	var exports = {};
	
	// Core database functionality (queries and transactions).
	exports.core = require('./db-core.js');
	var query = exports.core.query,
		transaction = exports.core.transaction;
	
	
	// Runs the SQL script that creates all tables.
	exports.createTables = function (callback) {
		fs.readFile(__dirname + '/../db/scripts/createTables.sql', 'utf8',
			function (err, data) {
				if (err)
					return err;
				query({
					text: data,
					callback: callback
				});
			}
		);
	};
	
	
	// Runs the SQL script that drops all tables.
	exports.dropTables = function (callback) {
		fs.readFile(__dirname + '/../db/scripts/dropTables.sql', 'utf8',
			function (err, data) {
				if (err)
					return err;
				query({
					text: data,
					callback: callback
				});
			}
		);
	};
	
	
	return exports;	
}();

