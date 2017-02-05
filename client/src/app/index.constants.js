(function() {
  'use strict';

  angular
    .module('client')
    .constant('config', {
      apiUrl: 'http://35.166.33.119:4000',
      tokenKey: 'token',
      profileKey: 'profile'
    });
})();
