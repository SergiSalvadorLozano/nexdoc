'use strict';

module.exports = function (){
  var helpers = {};

  // FUNCTIONALITY

  helpers.sendResponse = function (res, status, data, options) {
    res.status(status).json({data: data, options: options});
  };


}
