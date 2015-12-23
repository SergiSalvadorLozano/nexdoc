'use strict';


angular.module('nexdocApp').config(function ($translateProvider) {
  $translateProvider.translations('fr', {

    'ACTION_ACCEPT': 'Accepter',
    'ACTION_CANCEL': 'Annuler',

    'LANG_NAME_ENGLISH': 'Anglais',
    'LANG_NAME_SPANISH': 'Espagnol',
    'LANG_NAME_CATALAN': 'Catalan',
    'LANG_NAME_FRENCH': 'Français',
    'LANG_NAME_GERMAN': 'Allemand',

    'ACCOUNT_SIGN_UP': 'S\'enregistrer',
    'ACCOUNT_SIGN_IN': 'Connexion',
    'ACCOUNT_SIGN_OUT': 'Sortir',
    'ACCOUNT_REMEMBER': 'Rester connecté',

    'ACCOUNT_TERMS': 'Termes et conditions',
    'ACCOUNT_TERMS_INTRO': 'Before creating an account, make sure you ' +
    'understand the following points. Non-compliance with the rules will ' +
    'usually result in a warning, but your account could be banned in some ' +
    'serious cases.',
    'ACCOUNT_TERMS_P1': 'First point.',
    'ACCOUNT_TERMS_P2': 'Second point.',
    'ACCOUNT_TERMS_P3': 'Third point.',
    'ACCOUNT_TERMS_P4': 'Fourth point.',
    'ACCOUNT_TERMS_P5': 'Fifth point.',

    'USER_NAME': 'Nom',
    'USER_EMAIL': 'Email',
    'USER_EMAIL_REPEAT': 'Réécrire email',
    'USER_PASSWORD': 'Mot de passe',
    'USER_PASSWORD_REPEAT': 'Réécrire mot de passe',

  });
});
