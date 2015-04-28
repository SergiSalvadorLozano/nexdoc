// Helper library with core database functionalities.

module.exports = function () {
	var pg = require('pg');
	
	var exports = {};
	
	// Default database configuration.
	exports.config = {
		user: 'postgres',
		password: 'postgres',
		database: 'nexdoc',
		host: 'localhost',
		port: 5432
	};
	
	
	// Processes a single query using a client pool.
	// Receives a query in object form (postgres prepared statement).
	exports.query = function (query) {
		// Connect to the client pool.
		pg.connect(exports.config, function(err, client, done) {
			
			// The callback needs to release the client with 'done'.
			var oldCallback = query.callback;
			query.callback = function (err, result) {
				done();
				if (typeof oldCallback === 'function')
					return oldCallback(err, result);
			};
			
			// In case of error fetching a client from the pool.
			if (err)
				return console.error(err);
			
			// Perform the query (some of the arguments might be undefined).
			client.query(query);
		});
	};
	
	
	// Atomically processes multiple sequential queries using the client pool.
	// Receives an array of queries in object form, and (optionally) a function
	// with closing actions for the 'COMMIT' callback.
	exports.transaction = function (queries, closing) {
		// A connection to the client pool is established.
		pg.connect(exports.config, function (err, client, done) {
			// In case of error fetching a client from the pool.
			if (err)
				return console.error(err);
			
			// Recursive function to process the queries.
			var transactionRec = function (queries) {
				// If there are no more queries left, we are done.
				if (queries.length === 0)
					return;
				
				// First query in line.
				var query = queries.shift();
				// Original callback (if provided).
				var oldCallback = query.callback;
				
				// The final callback for this query.
				query.callback = function (err, result) {
					// If there is an original callback, it's called first.
					if (typeof oldCallback !== 'undefined')
						oldCallback(err, result);
					// If an error occurs, roll back the whole transaction.
					if (err){
						console.error(err);
						client.query('ROLLBACK', function (err) {
							if (err)
								console.error(err);
							done();
						});
					}
					// Otherwise, move on to the next query in line.
					else
						transactionRec(queries);
				}

				// The query is executed with the new callback.
				client.query(query);
			};
			
			// 'BEGIN' and 'COMMIT' queries are appended to the query array.
			queries.unshift({text: 'BEGIN'});
			queries.push({text: 'COMMIT', callback: function () {
				done();
				if (typeof closing === 'function')
					closing();
			}});
			// The queries are processed one after the other recursively.
			transactionRec(queries);
		});
	};
	
	
	return exports;	
}();

