'use strict';

angular.module('newHnHiringApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl',
        reloadOnSearch: false,
        resolve: {
          data: ($q, $http, $route, $routeParams) => {
            const deferred = $q.defer();
            $http({ type: 'GET', url: '/api/jobs', params: $route.current.params })
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
