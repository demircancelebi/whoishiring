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
    $rootScope.locs = {
      sf: 'SF',
      ny: 'NYC',
      dc: 'Washington, DC',
      alisoViejo: 'Aliso Viejo',
      amsterdam: 'Amsterdam',
      annArbor: 'Ann Arbor',
      arlington: 'Arlington',
      ashford: 'Ashford',
      atlanta: 'Atlanta',
      austin: 'Austin',
      australia: 'Australia',
      baltimore: 'Baltimore',
      bangalore: 'Bangalore',
      barcelona: 'Barcelona',
      bayArea: 'Bay Area',
      belgrade: 'Belgrade',
      berkeley: 'Berkeley',
      berlin: 'Berlin',
      boise: 'Boise',
      boston: 'Boston',
      boulder: 'Boulder',
      brecksville: 'Brecksville',
      brixton: 'Brixton',
      budapest: 'Budapest',
      cambridge: 'Cambridge',
      canada: 'Canada',
      champaign: 'Champaign',
      charleston: 'Charleston',
      charlotte: 'Charlotte',
      charlottesville: 'Charlottesville',
      chicago: 'Chicago',
      cleveland: 'Cleveland',
      cologne: 'Cologne',
      colorado: 'Colorado',
      copenhagen: 'Copenhagen',
      costaMesa: 'Costa Mesa',
      cupertino: 'Cupertino',
      dallas: 'Dallas',
      daniaBeach: 'Dania Beach',
      denver: 'Denver',
      detroit: 'Detroit',
      dublin: 'Dublin',
      durham: 'Durham',
      edinburgh: 'Edinburgh',
      eindhoven: 'Eindhoven',
      florence: 'Florence',
      germany: 'Germany',
      glasgow: 'Glasgow',
      goldCoast: 'Gold Coast',
      gurgaon: 'Gurgaon',
      hasselt: 'Hasselt',
      heidelberg: 'Heidelberg',
      hongKong: 'Hong Kong',
      india: 'India',
      irving: 'Irving',
      israel: 'Israel',
      istanbul: 'Istanbul',
      italy: 'Italy',
      japan: 'Japan',
      kelowna: 'Kelowna',
      kitchener: 'Kitchener',
      lausanne: 'Lausanne',
      liege: 'Liege',
      london: 'London',
      losAngeles: 'Los Angeles',
      louisville: 'Louisville',
      manchester: 'Manchester',
      mcLean: 'McLean',
      medford: 'Medford',
      melbourne: 'Melbourne',
      mendrisio: 'Mendrisio',
      menloPark: 'Menlo Park',
      miami: 'Miami',
      montreal: 'Montreal',
      mountainView: 'Mountain View',
      newcastle: 'Newcastle',
      newJersey: 'New Jersey',
      newZealand: 'New Zealand',
      nuremberg: 'Nuremberg',
      oakland: 'Oakland',
      ontario: 'Ontario',
      oregon: 'Oregon',
      orangeCounty: 'Orange County',
      ottawa: 'Ottawa',
      paloAlto: 'Palo Alto',
      paris: 'Paris',
      pasadena: 'Pasadena',
      philadelphia: 'Philadelphia',
      pittsburgh: 'Pittsburgh',
      plano: 'Plano',
      portland: 'Portland',
      portsmouth: 'Portsmouth',
      prague: 'Prague',
      raleigh: 'Raleigh',
      redwoodCity: 'Redwood City',
      regensburg: 'Regensburg',
      remagen: 'Remagen',
      reston: 'Reston',
      riga: 'Riga',
      rioDeJaneiro: 'Rio de Janeiro',
      sanDiego: 'San Diego',
      sanJose: 'San Jose',
      sanMateo: 'San Mateo',
      seattle: 'Seattle',
      serbia: 'Serbia',
      shanghai: 'Shanghai',
      singapore: 'Singapore',
      sofia: 'Sofia',
      spain: 'Spain',
      stockholm: 'Stockholm',
      sunnyvale: 'Sunnyvale',
      sweden: 'Sweden',
      sydney: 'Sydney',
      tokyo: 'Tokyo',
      toronto: 'Toronto',
      waterloo: 'Waterloo',
      wiesbaden: 'Wiesbaden',
      zurich: 'Zurich'
    };

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

    $rootScope.wheres = {
      onsite: 'On site',
      remote: 'Remote'
    };

    $rootScope.types = {
      fulltime: 'Full time',
      parttime: 'Part time'
    };

    $rootScope.visa = {
      yes: 'Visa'
    };

    $rootScope.intern = {
      yes: 'Intern'
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
