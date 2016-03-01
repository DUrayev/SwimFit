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

swimFitControllers.controller('AddCtrl', ['$scope', '$ionicActionSheet',
  function($scope, $ionicActionSheet) {

    $scope.show = function() {
      $ionicActionSheet.show({
         buttons: [
           { text: 'Take a <b>Photo</b>' },
           { text: 'Take from <b>Album<b>' }
         ],
         titleText: 'Add training photo',
         cancelText: 'Cancel',
         cancel: function() {
              // add cancel code..
          },
         buttonClicked: function(index) {
           return true;
         }
       });
    }

  }
]);
