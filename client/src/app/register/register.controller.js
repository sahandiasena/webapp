(function () {
  'use strict';

  angular
    .module('client')
    .controller('RegisterController', RegisterController);

  /** @ngInject */
  function RegisterController($state, $log, User, Flash) {
    var vm = this;

    vm.register = register;

    function register() {
      User.create(vm.user)
        .then(function () {
          Flash.clear();
          Flash.create('success', 'User registered successfully');
          $state.go('login');
        })
        .catch(function (err) {
          $log.debug(err);
          Flash.create('danger', err.message);
        })
    }
  }
})();
