'use strict';

angular.module('newHnHiringApp')
  .controller('MainCtrl', function ($scope, $rootScope, data) {
    $scope.data = {
      filter: {},
      jobs: data.items
    };

    $rootScope.$on('edit job listing', (e, data) => {
      $scope.toEdit = data;
      $('#edit-listing-modal').modal();
    });

    $rootScope.$on('show more', (e, data, index) => {
      if ($scope.moreData === null) {
        $scope.moreData = data;
      } else {
        if ($scope.lastIndex === index) {
          $scope.moreData = null;
        } else {
          $scope.moreData = data;
        }
      }

      $scope.lastIndex = index;
      $scope.addAfter = (Math.floor(index/3)+1)*3;
    });
  });
