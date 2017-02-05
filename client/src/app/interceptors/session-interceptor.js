(function() {
  'use strict';

  angular
    .module('client')
    .factory('sessionInterceptor', SessionInterceptor);

  /** @ngInject */
  function SessionInterceptor(authService, $injector, $q) {
    var sessionInterceptor = {
      request: function(config) {
        if (authService.token) {
          config.headers['X-API-TOKEN'] = authService.token;
        }
        return config;
      },
      responseError: function (res) {
        if (res.status == 403) {
          var $state = $injector.get('$state');
          authService.logout();
          $state.go('login');
        }

        return $q.reject(res);
      }
    };
    return sessionInterceptor;
  }
})();
