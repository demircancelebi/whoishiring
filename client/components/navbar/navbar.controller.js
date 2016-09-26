'use strict';

class NavbarController {
  //end-non-standard

  //start-non-standard
  constructor($location, Auth) {
    this.$location = $location;
    this.isLoggedIn = Auth.isLoggedIn;
    this.isAdmin = Auth.isAdmin;
    this.getCurrentUser = Auth.getCurrentUser;
  }

  isActive(route) {
    return route === this.$location.path();
  }
}

angular.module('newHnHiringApp')
  .controller('NavbarController', NavbarController);
