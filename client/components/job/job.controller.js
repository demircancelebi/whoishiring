'use strict';

angular.module('newHnHiringApp')
  .controller('JobCtrl', function ($scope, $rootScope, Auth, $http) {
    $scope.isAdmin = Auth.isAdmin();
    if (!!($scope.data.where.indexOf('remote') > -1)) {
      if (!$scope.data.locs) {
        $scope.data.locs = [];
      }
      $scope.data.locs.unshift('remote');
    }

    const locs = _.clone($rootScope.locs);
    locs.remote = 'Remote';

    $scope.ctrl = {
      types: $rootScope.types,
      locs,
      wheres: $rootScope.wheres,
      field: $rootScope.field,
      stack: $rootScope.stack
    };

    $scope.fullLocs = '';

    const locsLen = $scope.data.locs.length;
    for (let i = 0; i < locsLen; i += 1) {
      $scope.fullLocs += $scope.ctrl.locs[$scope.data.locs[i]];
      if (i !== locsLen - 1) {
        $scope.fullLocs += ', ';
      }
    }

    $scope.showEditModal = (data) => {
      $rootScope.$broadcast('edit job listing', data);
    };

    $scope.onChange = (data) => {
      $http.put(`/jobs/${data._id}`, { active: $scope.data.active });
    };

    $scope.showMore = () => {
      $rootScope.$broadcast('show more', $scope.data, $scope.nth);
    };
  });
