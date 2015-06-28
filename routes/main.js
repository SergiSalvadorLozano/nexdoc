'use strict';

module.exports = function (express) {
  // Subrouters.
  var partialsRouter = require('./partials')(express);

  var router = express.Router({mergeParams: true});

  // Rendering of partial views.
  router.use('/partials', partialsRouter);

  // Rendering of the common layout. Routing is left to AngularJS.
  router.get('/*', function (req, res) {
    res.render('common');
  });


  return router;
};
