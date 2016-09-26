'use strict';

angular.module('newHnHiringApp')
  .controller('FilterCtrl', function ($scope, $rootScope) {
    $scope.ctrl = {
      dates: [
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
        }
      ],
      types: $rootScope.types,
      locs: $rootScope.locs,
      field: $rootScope.field,
      stack: $rootScope.stack
    };

    if (!$scope.data) {
      $scope.data = {
        onstory: $scope.ctrl.dates[0].id
      }
    } else {
      $scope.data.onstory = $scope.ctrl.dates[0].id;
    }
  });
