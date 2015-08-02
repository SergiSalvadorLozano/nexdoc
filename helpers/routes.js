'use strict';

module.exports = function (){
  var routesHlp = {};

  // FUNCTIONALITY

  routesHlp.sendResponse = function (res, code, data, options) {
    res.status(code).json({data: data, options: options});
  };


  return routesHlp;
}();
