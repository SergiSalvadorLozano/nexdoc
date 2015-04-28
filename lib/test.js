// Helper library with testing functionalities.

module.exports = function (){
	var exports = {};
	
	
	// Alternative configuration object for the test database.
	exports.dbConfig = {
		user: 'postgres',
		password: 'postgres',
		database: 'nexdoc_test',
		host: 'localhost',
		port: 5432
	};
	
	
	// Performs an action for every element in an array. Then calls 'allDone()'.
	// Actions are all performed concurrently if possible.
	// Arguments:
	//  - action: function with two arguments, in this order:
	//    - element: one of the elements in the array.
	//    - index: position of the element in the array.
	//    - oneDone: a function which must be called inside 'action' when it is
	//      over for an element.
	//  - allDone: a function without arguments, that will be called when the
	//    action has been completed for all elements.
	// Returns nothing.
	exports.forEachElement = function (elements, action, allDone) {
		var completed = 0;
		
		var oneDone = function () {
			completed += 1;
			if (completed >= elements.length)
				allDone();
		}
		
		for (var i = 0 ; i < elements.length ; i += 1)
			action(elements[i], i, oneDone);
	};
	
	
	// Same as 'forEachElement', but actions are performed non-concurrently.
	exports.forEachElementNC = function (elements, action, allDone) {
		var i = 0;
		
		var oneDone = function () {
			if (i >= elements.length - 1)
				allDone();
			else {
				i += 1;
				action(elements[i], i, oneDone);
			}
		};
		
		action(elements[i], i, oneDone);
	}
	
	
	return exports;
}();