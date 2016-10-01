'use strict';

angular.module('newHnHiringApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl',
        reloadOnSearch: false,
        resolve: {
          data: ($q, $http) => {
            const deferred = $q.defer();

            $http({ type: 'GET', url: '/api/jobs' })
            .success(data => {
              deferred.resolve(data);
            }).error(() => {
              deferred.reject(null);
            }).finally(() => {
              cfpLoadingBar.complete();
            });

            return deferred.promise;
          }
        }
      });
  });
