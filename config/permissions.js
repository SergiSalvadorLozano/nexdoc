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
    'viewOwnProfile',
    'editOwnProfile',
    'deleteOwnAccount'
  ];
  // Permissions assigned to the role 'admin'.
  permissions[roles['admin']] = [
    'viewAllProfiles',
    'editAllProfiles',
    'deleteAllAccounts'
  ];

  permCfg.roles = roles;
  permCfg.permissions = permissions;
  return permCfg;
}();
