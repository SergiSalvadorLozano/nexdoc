'use strict';

module.exports = function (express, auth) {
  // Subrouters.
  var partialsRouter = require('./partials')(express, auth);

  var router = express.Router({mergeParams: true});

  // Rendering of partial views.
  router.use('/partials', partialsRouter);

  // Login API request.
  router.post('/api/login', function (req, res) {
    auth.passport.authenticate('user', function (err, user) {
      if (err)
        res.sendStatus(500);
      else if (!user)
        res.sendStatus(404);
      else {
        res.status(200).json(user);
      }
    }, { session: false })(req, res);
  });

  // Rendering of the common layout. Routing is left to front-end.
  router.get('/*', function (req, res) {
    res.render('common');
  });


  return router;
};
