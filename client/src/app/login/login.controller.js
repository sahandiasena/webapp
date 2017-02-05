(function () {
  'use strict';

  angular
    .module('client')
    .controller('LoginController', LoginController);

  /** @ngInject */
  function LoginController($rootScope, $state, $log, $timeout, Session, authService, Flash) {
    var vm = this;

    vm.authenticate = authenticate;
    vm.verify = verify;
    vm.resend = resend;

    function authenticate() {
      Session.authenticate(vm.login)
        .then(function (res) {
          if (res.authyResponse.success) {
            authService.login(res);
            Flash.clear();
            Flash.create("info", "Waiting for one touch approval.", 0);
            checkOneTouchStatus();
          } else if (!res.authyResponse.success) {
            authService.login(res);
            resend();
            Flash.clear();
            $state.go('verify');
          } else {
            $log.debug(res);
            Flash.create("danger", res.message);
          }
        })
        .catch(function (err) {
          $log.debug(err);
          Flash.create("danger", err.message, 0);
        })
    }

    function verify() {
      Session.verify(vm.login)
        .then(function (res) {
          authService.login(res);
          $rootScope.$broadcast('userLoggedIn');
          $state.go("home");
        })
        .catch(function (error) {
          $log.debug(error);
          Flash.create('danger', error.message);
        })
    }

    function resend() {
      Session.resend()
        .then(function () {
          Flash.create('info', "Confirmation code sent.");
        })
        .catch(function (err) {
          $log.debug(err);
          Flash.create('danger', err.message);
        })
    }

    function checkOneTouchStatus() {
      Session.checkOneTouchStatus()
        .then(function (res) {
            if (res.status == 'approved') {
              authService.login(res);
              $rootScope.$broadcast('userLoggedIn');
              Flash.clear();
              $state.go('home');
            } else if (res.status == 'denied') {
              Flash.clear();
              $state.go('verify');
            } else {
              $timeout(checkOneTouchStatus, 3000);
            }
          })
        .catch(function (err) {
          $log.debug(err);
          Flash.create('danger', err.message);
      })
    }
  }
})();
