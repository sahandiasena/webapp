(function() {
  'use strict';

  angular
    .module('client')
    .config(config);

  /** @ngInject */
  function config($logProvider, $httpProvider, toastrConfig, FlashProvider) {
    // Enable log
    $logProvider.debugEnabled(true);

    // Set options third-party lib
    toastrConfig.allowHtml = true;
    toastrConfig.timeOut = 3000;
    toastrConfig.positionClass = 'toast-top-right';
    toastrConfig.preventDuplicates = true;
    toastrConfig.progressBar = true;

    $httpProvider.interceptors.push('sessionInterceptor');

    FlashProvider.setTimeout(5000);
    FlashProvider.setShowClose(true);
  }

})();
