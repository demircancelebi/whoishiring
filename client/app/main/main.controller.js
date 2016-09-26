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
  });
