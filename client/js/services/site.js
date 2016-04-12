'use strict';


angular.module('nexdocApp').constant('Site', {

  // Site sections and subsections.

  sections: {
    home: {
      text: 'SECTION_HOME',
      inMenu: false,
      defaultSubsection: 'index',
      subsections: {
        index: {
          text: 'SUBSECTION_HOME_INDEX',
          inMenu: true
        },
        blog: {
          text: 'SUBSECTION_HOME_BLOG',
          inMenu: true
        },
        faq: {
          text: 'SUBSECTION_HOME_FAQ',
          inMenu: true
        }
      }
    },
    user: {
      text: 'SECTION_USER',
      inMenu: false,
      defaultSubsection: 'profile',
      subsections: {
        profile: {
          text: 'SUBSECTION_USER_PROFILE',
          inMenu: true
        },
        settings: {
          text: 'SUBSECTION_USER_SETTINGS',
          inMenu: true
        }
      }
    },
    contacts: {
      text: 'SECTION_CONTACTS',
      inMenu: function ($scope) {
        return !!$scope.user;
      },
      menuIcon: 'person',
      defaultSubsection: 'list',
      subsections: {
        list: {
          text: 'SUBSECTION_CONTACTS_LIST',
          inMenu: true
        },
        requests: {
          text: 'SUBSECTION_CONTACTS_REQUESTS',
          inMenu: true
        },
        find: {
          text: 'SUBSECTION_CONTACTS_FIND',
          inMenu: true
        }
      }
    },
    groups: {
      text: 'SECTION_GROUPS',
      inMenu: function ($scope) {
        return !!$scope.user;
      },
      menuIcon: 'group',
      defaultSubsection: 'list',
      subsections: {
        list: {
          text: 'SUBSECTION_GROUPS_LIST',
          inMenu: true
        },
        invitations: {
          text: 'SUBSECTION_GROUPS_INVITATIONS',
          inMenu: true
        },
        find: {
          text: 'SUBSECTION_GROUPS_FIND',
          inMenu: true
        },
        new: {
          text: 'SUBSECTION_GROUPS_NEW',
          inMenu: true
        }
      }
    },
    conversations: {
      text: 'SECTION_CONVERSATIONS',
      inMenu: function ($scope) {
        return !!$scope.user;
      },
      menuIcon: 'question_answer',
      defaultSubsection: 'list',
      subsections: {
        list: {
          text: 'SUBSECTION_CONVERSATIONS_LIST',
          inMenu: true
        },
        new: {
          text: 'SUBSECTION_CONVERSATIONS_NEW',
          inMenu: true
        }
      }
    },
    resources: {
      text: 'SECTION_RESOURCES',
      inMenu: function ($scope) {
        return !!$scope.user;
      },
      menuIcon: 'cloud',
      defaultSubsection: 'list',
      subsections: {
        list: {
          text: 'SUBSECTION_RESOURCES_LIST',
          inMenu: true
        },
        find: {
          text: 'SUBSECTION_RESOURCES_FIND',
          inMenu: true
        },
        new: {
          text: 'SUBSECTION_RESOURCES_NEW',
          inMenu: true
        }
      }
    }
  },


  // Site languages.

  languages: {
    'cat': {
      code: 'cat',
      name: 'CATALÀ'
    },
    'de': {
      code: 'de',
      name: 'DEUTSCH'
    },
    'en': {
      code: 'en',
      name: 'ENGLISH'
    },
    'es': {
      code: 'es',
      name: 'ESPAÑOL'
    },
    'fr': {
      code: 'fr',
      name: 'FRANÇAIS'
    }
  }
});
