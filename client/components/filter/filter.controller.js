'use strict';

angular.module('newHnHiringApp')
  .controller('FilterCtrl', function ($scope, $rootScope, $route, $location) {
    $scope.ctrl = {
      dates: [
        {
          name: 'October 2016',
          id: 'October2016'
        },
        {
          name: 'September 2016',
          id: 'September2016'
        },
        {
          name: 'August 2016',
          id: 'August2016'
        },
        {
          name: 'July 2016',
          id: 'July2016'
        },
        {
          name: 'June 2016',
          id: 'June2016'
        },
        {
          name: 'May 2016',
          id: 'May2016'
        },
        {
          name: 'April 2016',
          id: 'April2016'
        },
        {
          name: 'March 2016',
          id: 'March2016'
        },
        {
          name: 'February 2016',
          id: 'February2016'
        },
        {
          name: 'January 2016',
          id: 'January2016'
        }
      ],
      types: $rootScope.types,
      locs: $rootScope.locs,
      wheres: $rootScope.wheres,
      field: $rootScope.field,
      stack: $rootScope.stack,
      visa: $rootScope.visa,
      intern: $rootScope.intern
    };

    $scope.getParamsFromFilters = () => {
      let params = {};

      Object.keys($scope.data.filter).forEach((k, i) => {
        if($scope.data.filter[k].constructor === String) {
          params[k] = $scope.data.filter[k];
        } else if ($scope.data.filter[k].constructor === Array) {
          if (!params[k]) {
            params[k] = [];
          }

          $scope.data.filter[k].forEach((v) => {
            params[k].push(v);
          });
        } else if ($scope.data.filter[k].constructor === Object) {
          if (!params[k]) {
            params[k] = [];
          }
          Object.keys($scope.data.filter[k]).forEach((key, index) => {
            if ($scope.data.filter[k][key]) {
              params[k].push(key);
            }
          })
        }
      });
      params.page = 1;
      return params;
    };

    $scope.mapParamsToFilter = () => {
      const p = $route.current.params;
      const filter = {};

      Object.keys(p).forEach((key, index) => {
        if (key === 'type' || key === 'where' || key === 'visa' || key === 'intern') {
          $scope.data.filter[key] = {};
          if (p[key].constructor === String) {
            p[key] = [p[key]];
          }
          p[key].forEach((k, i) => {
            $scope.data.filter[key][k] = true;
          });
        } else if (key === 'intern' || key === 'locs' || key === 'field' || key === 'onstory' || key === 'stack') {
          $scope.data.filter[key] = p[key];
        }
      });
    };

    $scope.search = () => {
      const params = $scope.getParamsFromFilters();
      $route.updateParams(params);
    };

    $rootScope.$on('$locationChangeSuccess', (event, next, current) => {
      const params = $location.$$url.replace('/?', '?');
      $rootScope.$broadcast('make new search', params);
    });

    $scope.mapParamsToFilter();
  });
