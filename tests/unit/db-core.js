var assert = require('assert'),
	dbc = require('../../lib/db-core.js'),
	test = require('../../lib/test.js');

	
// Switch to the test database configuration.
dbc.config = test.dbConfig;


describe('Core Database Module', function () {
	
	beforeEach('Prepare \'test\' table', function (done) {
		// Create a 'testTable' table with an element.
		dbc.transaction([
			{
				text: 'DROP TABLE IF EXISTS "test"',
				callback: function (err, res) { if (err) return done(err); }
			},
			{
				text: 'CREATE TABLE "test" ("name" varchar(64))',
				callback: function (err, res) { if (err) return done(err); }
			},
			{
				text: 'INSERT INTO "test" ("name") values($1)',
				values: ['element0'],
				callback: function (err, res) { if (err) return done(err); }
			}
		], done);
	});
	
	
	afterEach('Drop \'test\' table', function (done) {
		// Delete the 'testTable' table.
		dbc.query(
			{
				text: 'DROP TABLE IF EXISTS "test"',
				callback: function (err) { if (err) return done(err); done(); }
			}
		);
	});
	
	
	it('Should be able to perform single queries', function (done) {
		// Select query for the only element in the 'testTable' table.
		dbc.query({
			text: 'SELECT "name" FROM "test"',
			callback: function (err, res) {
				if (err)
					return done(err);
				var elements = res.rows;
				assert.equal(elements.length, 1);
				assert.equal(elements[0].name, 'element0');
				done();
			}
		});
	});
	
	
	it('Should be able to perform transactions', function (done) {
		// Two insert queries and a select query for all three elements.
		dbc.transaction([
			{
				text: 'INSERT INTO "test" ("name") values($1)',
				values: ['element1'],
				callback: function (err, res) { if (err) return done(err); }
			},
			{
				text: 'INSERT INTO "test" ("name") values($1)',
				values: ['element2'],
				callback: function (err, res) { if (err) return done(err); }
			},
			{
				text: 'SELECT * FROM "test"',
				callback: function (err, res) {
					if (err)
						return done(err);
					var elements = res.rows;
					assert.equal(elements.length, 3);
					for (var i = 0 ; i < elements.length ; i += 1)
						assert.equal(elements[i].name, 'element' + i);
					done();
				}
			}
		]);
	});
	
	
});