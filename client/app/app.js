'use strict';

angular.module('newHnHiringApp', [
  'newHnHiringApp.constants',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ui.bootstrap',
  'validation.match',
  'ngMaterial'
])
  .config(function($routeProvider, $locationProvider, $httpProvider) {
    $routeProvider
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
  })

  .factory('authInterceptor', function($rootScope, $q, $cookies, $location) {
    return {
      // Add authorization token to headers
      request: function(config) {
        config.headers = config.headers || {};
        if ($cookies.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookies.get('token');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if (response.status === 401) {
          $location.path('/login');
          // remove any stale tokens
          $cookies.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  })

  .run(function($rootScope, $location, Auth) {
    // Redirect to login if route requires auth and the user is not logged in
    $rootScope.stack = {
      javascript: 'Javascript',
      nodejs: 'Node.js',
      python: 'Python',
      ruby: 'Ruby',
      go: 'Go',
      java: 'Java',
      rust: 'Rust',
      scala: 'Scala',
      php: 'PHP',
      c: 'C',
      cpp: 'C++',
      csharp: 'C#',
      aws: 'AWS',
      docker: 'Docker',
      kubernetes: 'Kubernetes',
      mongodb: 'MongoDB',
      redis: 'Redis',
      machinelearning: 'Machine Learning',
      mysql: 'MySQL',
      postgresql: 'PostgreSQL',
      elasticsearch: 'Elasticsearch',
      angular: 'Angular',
      react: 'React',
      django: 'Django',
      spark: 'Spark',
      kafka: 'Kafka',
      linux: 'Linux',
      unity: 'Unity',
      rabbit: 'RabbitMQ',
      hadoop: 'Hadoop',
      backbone: 'Backbone.js',
      ember: 'Ember.js',
      webrtc: 'Webrtc'
    };

    $rootScope.field = {
      frontend: 'Front-end',
      backend: 'Back-end',
      ios: 'iOS',
      android: 'Android',
      data: 'Data',
      devops: 'DevOps',
      fullstack: 'Full-stack',
      pm: 'Product Manager',
      sre: 'Site Reliability Engineer',
      security: 'Security Engineer'
    };

    $rootScope.locs = {
      onsite: 'On site',
      remote: 'Remote'
    };

    $rootScope.types = {
      fulltime: 'Full time',
      parttime: 'Part time',
      visa: 'Visa',
      intern: 'Intern'
    };



    $rootScope.$on('$routeChangeStart', function(event, next) {
      if (next.authenticate) {
        Auth.isLoggedIn(function(loggedIn) {
          if (!loggedIn) {
            event.preventDefault();
            $location.path('/login');
          }
        });
      }
    });
  });
