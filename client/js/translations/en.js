'use strict';


angular.module('nexdocApp').config(function ($translateProvider) {
  $translateProvider.translations('en', {

    'ACTION_ACCEPT': 'Accept',
    'ACTION_CANCEL': 'Cancel',

    'LANG_NAME_ENGLISH': 'English',
    'LANG_NAME_SPANISH': 'Spanish',
    'LANG_NAME_CATALAN': 'Catalan',
    'LANG_NAME_FRENCH': 'French',
    'LANG_NAME_GERMAN': 'German',

    'ACCOUNT_SIGN_UP': 'Sign up',
    'ACCOUNT_SIGN_IN': 'Sign in',
    'ACCOUNT_SIGN_OUT': 'Sign out',
    'ACCOUNT_REMEMBER': 'Remember me',

    'ACCOUNT_TERMS': 'Terms and conditions',
    'ACCOUNT_TERMS_INTRO': 'Before creating an account, make sure that you ' +
    'understand the following points. Non-compliance with the rules will ' +
    'usually result in a warning, but your account could be banned in some ' +
    'serious cases.',
    'ACCOUNT_TERMS_P1': 'Be respectful. While interacting with other people, ' +
    'try to avoid foul language and offensive attitudes (both towards ' +
    'collectives and individuals). If in doubt, refer to your basic human ' +
    'empathy, or contact the website administrators.',
    'ACCOUNT_TERMS_P2': 'Don\'t spam, stalk, or doxx other users. In general,' +
    ' don\'t use the platform in any unintended manner that might be ' +
    'considered toxic for the rest of the community.',
    'ACCOUNT_TERMS_P3': 'Don\'t upload or publish explicitly violent or ' +
    'sexual images, as well as other strong graphic content of the not ' +
    'suitable for work kind.',
    'ACCOUNT_TERMS_P4': 'All content hosted on the platform must be compliant' +
    ' with the legislation of the country where the servers are located ' +
    '(in this case, Spain). Should we be legally required to remove ' +
    'illegal content, we will.',
    'ACCOUNT_TERMS_P5': 'You should also keep your own country\'s legislation' +
    ' in mind. If something you do online breaks the law where you are, you ' +
    'may be liable to legal consequences regardless of the location of the ' +
    'servers.',
    'ACCOUNT_TERMS_P6': 'We won\'t sell or share any private personal data ' +
    'with third parties. You should, however, be cautious with what personal ' +
    'information you decide to make public (like in any other site), as ' +
    'neither you nor we will have any control over it once it is so. You can ' +
    'find some general advice about this on our FAQ.',
    'ACCOUNT_TERMS_P7': 'You understand that this website can make use of ' +
    'cookies or other forms of local storage in order function properly.',
    'ACCOUNT_TERMS_P8': 'Ultimately, we reserve the right to modify or ' +
    'extend these terms at any time if we judge it necessary.',
    'ACCOUNT_TERMS_CLOSING': 'That\'s about it. Feel welcome to contact the ' +
    'administration team for any question or feedback. We hope you encounter ' +
    'in here an enjoyable and productive experience.',

    'USER_NAME': 'Name',
    'USER_EMAIL': 'Email',
    'USER_EMAIL_REPEAT': 'Rewrite email',
    'USER_PASSWORD': 'Password',
    'USER_PASSWORD_REPEAT': 'Rewrite password',

  });
});
