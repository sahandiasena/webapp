(function() {
  'use strict';

  angular
    .module('client')
    .controller('HeaderController', HeaderController);

  /** @ngInject */
  function HeaderController($rootScope, $state, $log, authService, Session, Flash) {
    var vm = this;
    var user = authService.profile;
    vm.logout = logout;
    vm.loggedIn = false;

    if (user) {
      vm.user = user;
      vm.loggedIn = true;
    }

    function logout() {
      Session.destroy()
        .then(function () {
          authService.logout();
          $rootScope.$broadcast('userLoggedIn');
          Flash.clear();
          $state.go('login');
        })
        .catch(function (err) {
          $log.debug(err);
          Flash.create("danger", err.message, 0);
        })
    }

    $rootScope.$on('userLoggedIn', function () {
      user = authService.profile;
      if (user) {
        vm.user = user;
        vm.loggedIn = true;
      } else {
        vm.user = user;
        vm.loggedIn = false;
      }
    });
  }
})();
