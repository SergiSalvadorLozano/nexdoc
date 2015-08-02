'use strict';

module.exports = function () {

  var permCfg = {};

  // User roles (permission groups).
  var roles = {
    'user': 1,
    'admin': 2
  };

  var permissions = {};
  // Permissions assigned to the role 'user'.
  permissions[roles['user']] = [
    'AccountDeleteOwn',
    'ProfileEditOwn',
    'ProfileViewOwn'
  ];
  // Permissions assigned to the role 'admin'.
  permissions[roles['admin']] = [
    'AccountDeleteAll',
    'ProfileEditAll',
    'ProfileViewAll'
  ];

  permCfg.roles = roles;
  permCfg.permissions = permissions;
  return permCfg;
}();
