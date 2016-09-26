'use strict';

angular.module('newHnHiringApp')
  .controller('JobCtrl', function ($scope, $rootScope, Auth, $http) {
    $scope.isAdmin = Auth.isAdmin();
    $scope.ctrl = {
      types: $rootScope.types,
      locs: $rootScope.locs,
      field: $rootScope.field,
      stack: $rootScope.stack
    };

    $scope.showEditModal = (data) => {
      $rootScope.$broadcast('edit job listing', data);
    };

    $scope.onChange = (data) => {
      $http.put(`/jobs/${data._id}`, { active: $scope.data.active });
    };
  });
