'use strict';

angular.module('newHnHiringApp')
  .controller('MainCtrl', function ($scope, $rootScope, $http, data) {
    $scope.data = {
      jobs: data.items,
      found: data.found
    };

    $rootScope.$on('make new search', (e, urlParams) => {
      $http.get(`/api/jobs${urlParams}`).success((d) => {
        $scope.data.jobs = d.items;
        $scope.data.found = d.found;
      });
    });

    $rootScope.$on('edit job listing', (e, data) => {
      $scope.toEdit = data;
      $('#edit-job-modal').modal();
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

    $scope.updateJob = () => {
      $http.put(`/api/jobs/${$scope.toEdit._id}`, { company: $scope.toEdit.company });
    };
  });
