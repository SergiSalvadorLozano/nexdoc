'use strict';


angular.module('nexdocApp').config(function ($translateProvider) {
  $translateProvider.translations('fr', {

    'LANG_NAME_ENGLISH': 'Anglais',
    'LANG_NAME_SPANISH': 'Espagnol',
    'LANG_NAME_CATALAN': 'Catalan',
    'LANG_NAME_FRENCH': 'Français',
    'LANG_NAME_GERMAN': 'Allemand',

    'ACCOUNT_SIGN_UP': 'S\'enregistrer',
    'ACCOUNT_SIGN_IN': 'Ouvrir session',
    'ACCOUNT_SIGN_OUT': 'Fermer session',

    'USER_NAME': 'Nom',
    'USER_EMAIL': 'E-Mail',
    'USER_PASSWORD': 'Mot de passe',

  });
});
