'use strict';

angular.module('newHnHiringApp')
  .controller('FilterCtrl', function ($scope, $rootScope, $route, $location) {
    $scope.ctrl = {
      dates: [
      {
        name: 'May 2018',
        id: 'May2018'
      },
      {
        name: 'April 2018',
        id: 'April2018'
      },
      {
        name: 'March 2018',
        id: 'March2018'
      },
      {
        name: 'February 2018',
        id: 'February2018'
      },
      {
        name: 'January 2018',
        id: 'January2018'
      },
      {
        name: 'December 2017',
        id: 'December2017'
      },
      {
        name: 'November 2017',
        id: 'November2017'
      },
      {
        name: 'October 2017',
        id: 'October2017'
      },
      {
        name: 'September 2017',
        id: 'September2017'
      },
      {
        name: 'August 2017',
        id: 'August2017'
      },
      {
        name: 'July 2017',
        id: 'July2017'
      },
      {
        name: 'June 2017',
        id: 'June2017'
      },
      {
        name: 'May 2017',
        id: 'May2017'
      },
      {
        name: 'April 2017',
        id: 'April2017'
      },
      {
        name: 'March 2017',
        id: 'March2017'
      },
      {
        name: 'February 2017',
        id: 'February2017'
      },
      {
        name: 'January 2017',
        id: 'January2017'
      },
      {
        name: 'December 2016',
        id: 'December2016'
      },
      {
        name: 'November 2016',
        id: 'November2016'
      },
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
      },
      {
        name: 'December 2015',
        id: 'December2015'
      },
      {
        name: 'November 2015',
        id: 'November2015'
      },
      {
        name: 'October 2015',
        id: 'October2015'
      },
      {
        name: 'September 2015',
        id: 'September2015'
      },
      {
        name: 'August 2015',
        id: 'August2015'
      },
      {
        name: 'July 2015',
        id: 'July2015'
      },
      {
        name: 'June 2015',
        id: 'June2015'
      },
      {
        name: 'May 2015',
        id: 'May2015'
      },
      {
        name: 'April 2015',
        id: 'April2015'
      },
      {
        name: 'March 2015',
        id: 'March2015'
      },
      {
        name: 'February 2015',
        id: 'February2015'
      },
      {
        name: 'January 2015',
        id: 'January2015'
      },
      {
        name: 'December 2014',
        id: 'December2014'
      },
      {
        name: 'November 2014',
        id: 'November2014'
      },
      {
        name: 'October 2014',
        id: 'October2014'
      },
      {
        name: 'September 2014',
        id: 'September2014'
      },
      {
        name: 'August 2014',
        id: 'August2014'
      },
      {
        name: 'July 2014',
        id: 'July2014'
      },
      {
        name: 'June 2014',
        id: 'June2014'
      },
      {
        name: 'May 2014',
        id: 'May2014'
      },
      {
        name: 'April 2014',
        id: 'April2014'
      },
      {
        name: 'March 2014',
        id: 'March2014'
      },
      {
        name: 'February 2014',
        id: 'February2014'
      },
      {
        name: 'January 2014',
        id: 'January2014'
      },
      {
        name: 'December 2013',
        id: 'December2013'
      },
      {
        name: 'November 2013',
        id: 'November2013'
      },
      {
        name: 'October 2013',
        id: 'October2013'
      },
      {
        name: 'September 2013',
        id: 'September2013'
      },
      {
        name: 'August 2013',
        id: 'August2013'
      },
      {
        name: 'July 2013',
        id: 'July2013'
      },
      {
        name: 'June 2013',
        id: 'June2013'
      },
      {
        name: 'May 2013',
        id: 'May2013'
      },
      {
        name: 'April 2013',
        id: 'April2013'
      },
      {
        name: 'March 2013',
        id: 'March2013'
      },
      {
        name: 'February 2013',
        id: 'February2013'
      },
      {
        name: 'January 2013',
        id: 'January2013'
      },
      {
        name: 'December 2012',
        id: 'December2012'
      },
      {
        name: 'November 2012',
        id: 'November2012'
      },
      {
        name: 'October 2012',
        id: 'October2012'
      },
      {
        name: 'September 2012',
        id: 'September2012'
      },
      {
        name: 'August 2012',
        id: 'August2012'
      },
      {
        name: 'July 2012',
        id: 'July2012'
      },
      {
        name: 'June 2012',
        id: 'June2012'
      },
      {
        name: 'May 2012',
        id: 'May2012'
      },
      {
        name: 'April 2012',
        id: 'April2012'
      },
      {
        name: 'March 2012',
        id: 'March2012'
      },
      {
        name: 'February 2012',
        id: 'February2012'
      },
      {
        name: 'January 2012',
        id: 'January2012'
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
