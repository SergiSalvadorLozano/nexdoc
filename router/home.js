// Routing for 'Home' views.

module.exports = function () {
	var express = require('express'),
		bodyParser = require('body-parser'),
		views = require('../views/home.js');
	
	var router = express.Router({mergeParams: true}),
		urlencodedParser = bodyParser.urlencoded({extended: true});
	
	
	// Route prefix from parent:
	// /(langCode)/home...
	
	// .../welcome
	router.get('/welcome', views.welcome);
	
	
	return router;
}();