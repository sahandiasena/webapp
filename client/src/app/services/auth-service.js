(function () {
  'use strict';

  angular
    .module('client')
    .factory('authService', AuthService);

  /** @ngInject */
  function AuthService(config) {
    return {
      get profile() {
        if (localStorage.profile) {
          return angular.fromJson(localStorage.getItem(config.profileKey));
        } else {
          return null;
        }
      },
      get token() {
        return angular.fromJson(localStorage.getItem(config.tokenKey));
      },
      get isAuthenticated() {
        if(this.token && this.profile) {
          return true;
        } else {
          return false;
        }
      },
      login: function (data) {
        if (data.user) {
          localStorage.setItem(config.profileKey, angular.toJson(data.user))
        }

        if (data.token) {
          localStorage.setItem(config.tokenKey, angular.toJson(data.token))
        }
      },
      logout: function () {
        localStorage.removeItem(config.profileKey);
        localStorage.removeItem(config.tokenKey);
      }
    }
  }
})();
