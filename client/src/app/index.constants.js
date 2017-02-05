(function() {
  'use strict';

  angular
    .module('client')
    .constant('config', {
      apiUrl: 'http://localhost:4000',
      tokenKey: 'token',
      profileKey: 'profile'
    });
})();
