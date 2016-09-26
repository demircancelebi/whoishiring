'use strict';

angular.module('newHnHiringApp.auth', ['newHnHiringApp.constants', 'newHnHiringApp.util',
    'ngCookies', 'ngRoute'
  ])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
