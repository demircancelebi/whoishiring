'use strict';

angular.module('newHnHiringApp')
  .directive('job', function () {
    return {
      templateUrl: 'components/job/job.html',
      restrict: 'E',
      scope: {
        data: '=',
        nth: '='
      },
      controller: 'JobCtrl',
      link: function (scope, element) {
        element.addClass('job');
      }
    };
  });
