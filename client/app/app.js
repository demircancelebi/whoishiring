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
      dc: 'Washington, DC',
      mountainView: 'Mountain View',
      daniaBeach: 'Dania Beach',
      ny: 'NYC',
      bayArea: 'Bay Area',
      mendrisio: 'Mendrisio',
      mcLean: 'McLean',
      austin: 'Austin',
      atlanta: 'Atlanta',
      menloPark: 'Menlo Park',
      eindhoven: 'Eindhoven',
      hasselt: 'Hasselt',
      liege: 'Liege',
      london: 'London',
      seattle: 'Seattle',
      costaMesa: 'Costa Mesa',
      berlin: 'Berlin',
      newZealand: 'New Zealand',
      sanMateo: 'San Mateo',
      denver: 'Denver',
      boulder: 'Boulder',
      dallas: 'Dallas',
      riga: 'Riga',
      melbourne: 'Melbourne',
      australia: 'Australia',
      paloAlto: 'Palo Alto',
      toronto: 'Toronto',
      edinburgh: 'Edinburgh',
      boston: 'Boston',
      reston: 'Reston',
      gurgaon: 'Gurgaon',
      bangalore: 'Bangalore',
      plano: 'Plano',
      louisville: 'Louisville',
      berkeley: 'Berkeley',
      redwoodCity: 'Redwood City',
      ottawa: 'Ottawa',
      montreal: 'Montreal',
      waterloo: 'Waterloo',
      sanJose: 'San Jose',
      remagen: 'Remagen',
      newJersey: 'New Jersey',
      amsterdam: 'Amsterdam',
      cupertino: 'Cupertino',
      chicago: 'Chicago',
      dublin: 'Dublin',
      pasadena: 'Pasadena',
      losAngeles: 'Los Angeles',
      irving: 'Irving',
      hongKong: 'Hong Kong',
      denver: 'Denver',
      cambridge: 'Cambridge',
      singapore: 'Singapore',
      barcelona: 'Barcelona',
      glasgow: 'Glasgow',
      budapest: 'Budapest',
      sofia: 'Sofia',
      tokyo: 'Tokyo',
      baltimore: 'Baltimore',
      stockholm: 'Stockholm',
      sweden: 'Sweden',
      colorado: 'Colorado',
      paris: 'Paris',
      charleston: 'Charleston',
      sanDiego: 'San Diego',
      copenhagen: 'Copenhagen',
      israel: 'Israel',
      kitchener: 'Kitchener',
      canada: 'Canada',
      portland: 'Portland',
      oregon: 'Oregon',
      arlington: 'Arlington',
      oakland: 'Oakland',
      pittsburgh: 'Pittsburgh',
      heidelberg: 'Heidelberg',
      kelowna: 'Kelowna',
      boise: 'Boise',
      charlottesville: 'Charlottesville',
      durham: 'Durham',
      miami: 'Miami',
      lausanne: 'Lausanne',
      shanghai: 'Shanghai',
      orangeCounty: 'Orange County',
      ontario: 'Ontario',
      newcastle: 'Newcastle',
      brixton: 'Brixton',
      champaign: 'Champaign',
      sydney: 'Sydney',
      manchester: 'Manchester',
      cleveland: 'Cleveland',
      charlotte: 'Charlotte',
      goldCoast: 'Gold Coast',
      medford: 'Medford',
      portsmouth: 'Portsmouth',
      medford: 'Medford',
      istanbul: 'Istanbul',
      ashford: 'Ashford',
      zurich: 'Zurich',
      florence: 'Florence',
      italy: 'Italy',
      spain: 'Spain',
      germany: 'Germany',
      cologne: 'Cologne',
      india: 'India',
      sunnyvale: 'Sunnyvale',
      alisoViejo: 'Aliso Viejo',
      regensburg: 'Regensburg',
      belgrade: 'Belgrade',
      serbia: 'Serbia',
      raleigh: 'Raleigh',
      annArbor: 'Ann Arbor',
      rioDeJaneiro: 'Rio de Janeiro',
      nuremberg: 'Nuremberg',
      prague: 'Prague',
      philadelphia: 'Philadelphia',
      detroit: 'Detroit',
      wiesbaden: 'Wiesbaden',
      melbourne: 'Melbourne',
      brecksville: 'Brecksville'
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
