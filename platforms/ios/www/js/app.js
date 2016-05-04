'use strict';

/* App Module */

var db = null;
var swimFitApp = angular.module('swimFitApp', [
  'ngRoute',
  'addController',
  'dashboardController',
  'overviewController',
  'swimFitFilters',
  'swimFitServices',
  'ionic',
  'ngCordova',
  'ionic-datepicker',
  'ion-affix',
  'chart.js'
]);

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