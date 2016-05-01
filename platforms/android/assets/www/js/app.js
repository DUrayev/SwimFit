'use strict';

/* App Module */

var db = null;
var swimFitApp = angular.module('swimFitApp', [
  'ngRoute',
  'swimFitControllers',
  'swimFitFilters',
  'swimFitServices',
  'ionic',
  'ngCordova',
  'ionic-datepicker'
]).run(function($ionicPlatform, $cordovaSQLite){

      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
  // $ionicPlatform.ready(function() {
  //   alert(window.sqlitePlugin);
  //     db = $cordovaSQLite.openDB({name: "my.db", location: 'default'});
  //     alert(db);
  //     $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS people (id integer primary key, firstname text, lastname text)");
  // });
});

// swimFitApp.config(['$routeProvider',
//   function($routeProvider) {
//     $routeProvider.
//       when('/overview', {
//         templateUrl: 'partials/overview.html',
//         controller: 'OverviewCtrl'
//       }).
//       when('/dashboard', {
//         templateUrl: 'partials/dashboard.html',
//         controller: 'DashboardCtrl'
//       }).
//       when('/add', {
//         templateUrl: 'partials/add.html',
//         controller: 'AddCtrl'
//       }).
//       otherwise({
//         redirectTo: '/overview'
//       });
//   }]);

swimFitApp.config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('tabs', {
      url: '/tab',
      abstract: true,
      templateUrl: 'templates/tabs.html'
    })
    .state('tabs.overview', {
      url: '/overview',
      views: {
        'overview-tab': {
          templateUrl: 'templates/overview.html',
          controller: 'OverviewCtrl'
        }
      }
    })
    .state('tabs.add', {
      url: '/add',
      views: {
        'add-tab': {
          templateUrl: 'templates/add.html',
          controller: 'AddCtrl'
        }
      }
    })
    .state('tabs.dashboard', {
      url: '/dashboard',
      views: {
        'dashboard-tab': {
          templateUrl: 'templates/dashboard.html',
          controller: 'DashboardCtrl',
          reload: true
        }
      }
    });


   $urlRouterProvider.otherwise('/tab/overview');
  }]);