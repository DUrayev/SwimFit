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

swimFitControllers.controller('DashboardCtrl', ['$scope', 'TrainingRecordsService',
  function($scope, TrainingRecordsService, $ionicView) {
    var groupByWeeks = function(trainings) {
      var groups = [];
      var lastStartOfWeek, lastEndOfWeek;

      trainings = trainings.sort(function (a,b) {
        if (+a.timestamp < +b.timestamp) {
          return 1;
        } else if (+a.timestamp > +b.timestamp) {
          return -1;
        } else {
          return 0;
        }
      });

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

    $scope.trainings = [];
    $scope.$on('$ionicView.enter', function(){
      $scope.loading = true;
      TrainingRecordsService.getTrainings().then(function(result){
          $scope.trainingsGroups = groupByWeeks(result);
          $scope.loading = false;
      }, function(error) {
        $scope.loading = false;
        alert(error);
      });
    });

    $scope.clearDB = function() {
      var db = window.openDatabase("Database", "1.0", "Swim Fit", 200000);
      db.transaction(function populateDB(tx) {
        tx.executeSql('DROP TABLE IF EXISTS training_records');
      }, function errorCB(err) {
          alert("Error processing SQL: "+ err.message);
      }, function successCB() {
          alert('Success');
      });
    };
  }
]);

swimFitControllers.controller('AddCtrl', ['$scope', '$ionicActionSheet', 'TrainingRecordsService', '$cordovaSQLite',
  function($scope, $ionicActionSheet, TrainingRecordsService, $cordovaSQLite) {

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
       alert('Failed because: ' + err);
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
        alert(result);
      }, function(error) {
        $scope.loading = false;
        alert(error);
      });
      // var query = "INSERT INTO people (firstname, lastname) VALUES (?,?)";
      // db = $cordovaSQLite.openDB({name: "my.db", location: 'default'});
      // alert(db);
      // $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS people (id integer primary key, firstname text, lastname text)");
      // alert(db);
      // $cordovaSQLite.execute(db, query, ['firstname', 'lastname']).then(function(res) {
      //     alert("INSERT ID -> " + res.insertId);
      // }, function (err) {
      //     alert(err);
      // });
    }
  }
]);
