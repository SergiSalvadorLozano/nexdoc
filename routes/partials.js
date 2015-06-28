'use strict';

module.exports = function (express) {
  var router = express.Router({mergeParams: true});

  // Home partials.
  router.get('/home/index', function (req, res){
    res.render('partials/home/index');
  });

  return router;
};