'use strict';

/* App Module */

var swimFitApp = angular.module('swimFitApp', [
  'ngRoute',
  'swimFitControllers',
  'swimFitFilters',
  'swimFitServices',
  'ionic'
]);

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
          templateUrl: 'templates/add.html'
        }
      }
    })
    .state('tabs.dashboard', {
      url: '/dashboard',
      views: {
        'dashboard-tab': {
          templateUrl: 'templates/dashboard.html'
        }
      }
    });


   $urlRouterProvider.otherwise('/tab/overview');
  }]);