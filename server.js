// Server

var express = require('express'),
	exphbs = require('express-handlebars'),
	mainRouter = require('./router/main.js');

var app = express(),
	hbs = exphbs.create({
		extname: '.hbs',
		layoutsDir: 'static/templates/layouts/',
		defaultLayout: 'common'
	}),
	port = 8000;
	
	
// Use the main router for all routes.
app.use('/', mainRouter);

// Use handlebars as the template rendering engine.
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', __dirname + '/static/templates');

// Start the server.
var server = app.listen(port, function() {
	console.log("Server started on port " + port + ".");
});