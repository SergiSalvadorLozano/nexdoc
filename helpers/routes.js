'use strict';

module.exports = function (){
  var routesHlp = {};

  // FUNCTIONALITY

  routesHlp.sendResponse = function (res, code, data, options, session) {
    res.status(code).json({data: data, options: options, session: session});
  };


  return routesHlp;
}();
