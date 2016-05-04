'use strict';

/* Controllers */

var swimFitControllers = angular.module('addController', []);

swimFitControllers.controller('AddCtrl', ['$scope', '$ionicActionSheet', 'TrainingRecordsService', '$ionicPopup', 
  function($scope, $ionicActionSheet, TrainingRecordsService, $ionicPopup) {
    $scope.clearForm = function() {
      $scope.currentDate = new Date();
      $scope.minDate = new Date(2010, 6, 1);
      $scope.maxDate = new Date(2017, 6, 31);

      $scope.training = {
        description: '',
        photoSrc: '',
        period: '',
        timestamp: $scope.currentDate.getTime(),
        distance: '1000'
      };
      $scope.displayPhotoArea = false;
    }

    $scope.clearForm();

    $scope.distances = {
      availableValues: []
    };

    for(var i = 100; i <= 8000; i += 100) {
      $scope.distances.availableValues.push('' + i);
    }
     
    $scope.datePickerCallback = function (val) {
      if (val) { 
        $scope.training.timestamp = val.getTime();
      }
    };


    var onPhotoURLSuccess = function (imageUrl, trainingPeriodIndex) {
      $scope.$apply(function (){
        $scope.displayPhotoArea = true;
        $scope.training.photoSrc = imageUrl;
        $scope.training.period = trainingPeriodIndex === 0 ? '0' : '1';//'1 Day Trainig' : 'All Week Trainig';
      });      
    };

    var onFail = function (err) {
      $ionicPopup.alert({
        title: 'Swim Fit',
        template: 'Failed because: ' + err
      });
    };

    var selectPhotoSource = function(trainingPeriodIndex) {
      $ionicActionSheet.show({
        buttons: [
          { text: 'Take a <b>Photo</b>' },
          { text: 'Take from <b>Album</b>' }
        ],
        titleText: 'Add training photo',
        cancelText: 'Cancel',
        cancel: function() {
          // add cancel code..
        },
        buttonClicked: function(index) {
          if(index === 0) {
            navigator.camera.getPicture(function(imageUrl){
              onPhotoURLSuccess(imageUrl, trainingPeriodIndex);
            }, onFail, { 
              quality: 50, 
              destinationType: navigator.camera.DestinationType.FILE_URI
            });
          } else if(index === 1) {
            navigator.camera.getPicture(function(imageUrl){
              onPhotoURLSuccess(imageUrl, trainingPeriodIndex);
            }, onFail, { 
              quality: 50, 
              destinationType: navigator.camera.DestinationType.FILE_URI,
              sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
            });
          }
          return true;
        }
      });
    }

    $scope.addTrainingPhoto = function() {
      $ionicActionSheet.show({
        buttons: [
          { text: '1 Day Trainig' },
          { text: 'All Week Trainig' }
        ],
        titleText: 'Select training photo period',
        cancelText: 'Cancel',
        cancel: function() {
          // add cancel code..
        },
        buttonClicked: function(trainingPeriodIndex) {
          selectPhotoSource(trainingPeriodIndex);
          return true;
        }
      });
    }

    $scope.saveTrainingRecord = function() {
      $scope.loading = true;
      TrainingRecordsService.saveTraining($scope.training).then(function(result){
        $scope.loading = false;
        $scope.clearForm();
        $ionicPopup.alert({
          title: 'Swim Fit',
          template: result
        });
      }, function(error) {
        $scope.loading = false;
        $ionicPopup.alert({
          title: 'Swim Fit',
          template: error
        });
      });
    }
  }
]);
