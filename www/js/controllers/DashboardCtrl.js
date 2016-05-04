'use strict';

/* Controllers */

var swimFitControllers = angular.module('dashboardController', []);

swimFitControllers.controller('DashboardCtrl', ['$scope', '$ionicActionSheet', 'TrainingRecordsService', '$ionicPopup',
  function($scope, $ionicActionSheet, TrainingRecordsService, $ionicPopup, $ionicView) {
    var groupByWeeks = function(trainings) {
      var groups = [];
      var lastStartOfWeek, lastEndOfWeek;

      for (var i=0; i<trainings.length; i++) {
        if(!lastStartOfWeek || !moment(+trainings[i].timestamp).isBetween(lastStartOfWeek, lastEndOfWeek, null, '[]')) {
          lastStartOfWeek = moment(+trainings[i].timestamp).startOf('isoweek');
          lastEndOfWeek = moment(+trainings[i].timestamp).endOf('isoweek');
          groups.push({
            weekTitle: lastStartOfWeek.format('D MMM') + ' - ' + lastEndOfWeek.format('D MMM YYYY'),
            trainings: []
          });
        }
        groups[groups.length -1].trainings.push(trainings[i]);
      }
      return groups;
    };

    var refresh = function() {
      $scope.loading = true;
      TrainingRecordsService.getTrainings().then(function(result){
          $scope.trainingsGroups = groupByWeeks(result);
          $scope.loading = false;
      }, function(error) {
        $scope.loading = false;
        $ionicPopup.alert({
          title: 'Swim Fit',
          template: error
        });
      });
    };

    $scope.trainings = [];
    $scope.$on('$ionicView.enter', function(){
      refresh();
    });

    $scope.deleteTrainingRecord = function(id) {
      var hideSheet = $ionicActionSheet.show({
        destructiveText: 'Delete',
        titleText: 'Delete Training Record',
        cancelText: 'Cancel',
        cancel: function() {
          // add cancel code..
        },
        destructiveButtonClicked: function() {
          hideSheet();
          $scope.loading = true;
          TrainingRecordsService.deleteTraining(id).then(function(result){
            $scope.loading = false;
            $ionicPopup.alert({
              title: 'Swim Fit',
              template: result
            });
            refresh();
          }, function(error) {
            $scope.loading = false;
            $ionicPopup.alert({
              title: 'Swim Fit',
              template: error
            });
          });
        }
      });
    };

    $scope.clearDB = function() {
      var db = window.openDatabase("Database", "1.0", "Swim Fit", 200000);
      db.transaction(function populateDB(tx) {
        tx.executeSql('DROP TABLE IF EXISTS training_records');
      }, function errorCB(err) {
        $ionicPopup.alert({
          title: 'Swim Fit',
          template: "Error processing SQL: "+ err.message
        });
      }, function successCB() {
        $ionicPopup.alert({
          title: 'Swim Fit',
          template: "Success"
        });
      });
    };
  }
]);