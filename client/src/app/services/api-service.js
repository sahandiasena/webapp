(function () {
  'use strict';

  angular
    .module('client')
    .factory('Session', Session)
    .factory('User', User);

  /** @ngInject */
  function Session($http, config) {
    return {
      authenticate: function authenticate(login) {
        return $http.post(config.apiUrl + '/session', login).then(handleSuccess, handleError);
      },
      checkOneTouchStatus: function  checkOneTouchStatus() {
        return $http.get(config.apiUrl + '/authy/status').then(handleSuccess, handleError);
      },
      verify: function verify(login) {
        return $http.post(config.apiUrl + '/authy/verify', login).then(handleSuccess, handleError);
      },
      destroy: function () {
        return $http.delete(config.apiUrl + '/session').then(handleSuccess, handleError);
      },
      resend: function () {
        return $http.post(config.apiUrl + '/authy/resend').then(handleSuccess, handleError);
      }
    };
  }

  /** @ngInject */
  function User($http, config) {
    return {
      create: function Create(user) {
        return $http.post(config.apiUrl + '/users', user).then(handleSuccess, handleError);
      }
    };
  }

  function handleSuccess(res) {
    return res.data;
  }

  function handleError(err) {
    throw err.data;
  }

})();
