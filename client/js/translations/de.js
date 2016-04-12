'use strict';


angular.module('nexdocApp').config(function ($translateProvider) {
  $translateProvider.translations('de', {

    'ACTION_ACCEPT': 'Akzeptieren',
    'ACTION_CANCEL': 'Absagen',

    SECTION_CONTACTS: 'Contacts',
    SECTION_GROUPS: 'Groups',
    SECTION_CONVERSATIONS: 'Conversations',
    SECTION_RESOURCES: 'Resources',
    SUBSECTION_HOME_INDEX: 'Index',
    SUBSECTION_HOME_BLOG: 'Blog',
    SUBSECTION_HOME_FAQ: 'FAQ',
    SUBSECTION_HOME_CONTACT: 'Contact',
    SUBSECTION_USER_PROFILE: 'Profile',
    SUBSECTION_USER_SETTINGS: 'Settings',
    SUBSECTION_CONTACTS_LIST: 'My contacts',
    SUBSECTION_CONTACTS_REQUESTS: 'Requests',
    SUBSECTION_CONTACTS_FIND: 'Finder',
    SUBSECTION_GROUPS_LIST: 'My groups',
    SUBSECTION_GROUPS_INVITATIONS: 'Invitations',
    SUBSECTION_GROUPS_FIND: 'Finder',
    SUBSECTION_GROUPS_NEW: 'New group',
    SUBSECTION_CONVERSATIONS_LIST: 'My conversations',
    SUBSECTION_CONVERSATIONS_NEW: 'New conversation',
    SUBSECTION_RESOURCES_LIST: 'My resources',
    SUBSECTION_RESOURCES_FIND: 'Finder',
    SUBSECTION_RESOURCES_NEW: 'New resource',

    'ACCOUNT_SIGN_UP': 'Sich einschreiben',
    'ACCOUNT_SIGN_IN': 'Anmelden',
    'ACCOUNT_SIGN_OUT': 'Abmelden',
    'ACCOUNT_REMEMBER': 'Angemeldet bleiben',

    'ACCOUNT_TERMS': 'Geschäftsbedingungen',
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
    'USER_EMAIL_REPEAT': 'Email wiederschreiben',
    'USER_PASSWORD': 'Passwort',
    'USER_PASSWORD_REPEAT': 'Passwort wiederschreiben',

  });
});
