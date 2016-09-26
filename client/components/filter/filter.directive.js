'use strict';

angular.module('newHnHiringApp')
  .directive('filter', function () {
    return {
      templateUrl: 'components/filter/filter.html',
      restrict: 'E',
      controller: 'FilterCtrl',
      link: function (scope, element) {
        element.addClass('filter');
      }
    };
  });
