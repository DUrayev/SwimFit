'use strict';

/* Controllers */

var swimFitControllers = angular.module('swimFitControllers', []);

swimFitControllers.controller('OverviewCtrl', ['$scope',
  function($scope) {
  	$scope.message = 'Hello world';
  	$scope.slideHasChanged = function(index) {
  		$scope.index = index;
  	}
  }
]);

swimFitControllers.controller('DashboardCtrl', ['$scope',
  function($scope) {

  }
]);

swimFitControllers.controller('AddCtrl', ['$scope',
  function($scope) {

  }
]);
