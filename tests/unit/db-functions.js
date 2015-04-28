var assert = require('assert'),
	db = require('../../lib/db-functions.js'),
	test = require('../../lib/test.js');

	
// Switch to the test database.
db.core.config = test.dbConfig;


describe('Database Functions Module', function () {
	
	beforeEach('Set a clean database with all the tables.', function (done) {
		db.dropTables(function () {
			db.createTables(done);
		});
	});
	
	
	afterEach('Remove all relevant tables from the database.', function (done) {
		db.dropTables(done);
	});
	

	// it('Should be able to ... ', function (done) {
		// done();
	// });
	
	
	
});