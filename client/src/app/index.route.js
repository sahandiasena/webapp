(function() {
  'use strict';

  angular
    .module('client')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'vm',
        resolve: {
          loginRequired: loginRequired
        }
      })
      .state('register', {
        url: '/register',
        templateUrl: 'app/register/register.html',
        controller: 'RegisterController',
        controllerAs: 'vm',
        resolve: {
          skipIfLoggedIn: skipIfLoggedIn
        }
      })
      .state('login', {
        url: '/login',
        templateUrl: 'app/login/login.html',
        controller: 'LoginController',
        controllerAs: 'vm',
        resolve: {
          skipIfLoggedIn: skipIfLoggedIn
        }
      })
      .state('verify', {
        url: '/verify',
        templateUrl: 'app/login/login.verify.html',
        controller: 'LoginController',
        controllerAs: 'vm',
        resolve: {
          skipIfLoggedIn: skipIfLoggedIn
        }
      });

    $urlRouterProvider.otherwise('/');

    function skipIfLoggedIn($q, $location, authService) {
      var deferred = $q.defer();
      if (authService.isAuthenticated) {
        $location.path('/');
      } else {
        deferred.resolve();
      }
      return deferred.promise;
    }

    function loginRequired($q, $location, authService) {
      var deferred = $q.defer();
      if (authService.isAuthenticated) {
        deferred.resolve();
      } else {
        $location.path('/login');
      }
      return deferred.promise;
    }
  }

})();
