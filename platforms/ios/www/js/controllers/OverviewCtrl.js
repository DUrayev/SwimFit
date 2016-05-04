'use strict';

/* Controllers */

var swimFitControllers = angular.module('overviewController', []);

swimFitControllers.controller('OverviewCtrl', ['$scope', 'TrainingRecordsService', '$ionicPopup',
  function($scope, TrainingRecordsService, $ionicPopup, $ionicView) {
    $scope.loading = true;

    

    $scope.$on('$ionicView.enter', function(){
      $scope.loading = true;
      $scope.statistics = {
        thisDay: 0,
        totalDistance: 0,
        totalThisMonthDistance: 0,
        totalThisWeekDistance: 0,
        totalLastMonthDistance: 0,
        totalLastWeekDistance: 0,
        averageInDay: 0,
        averageInMonth: 0
      };
      $scope.bar = {
        labels: [],
        data: [[]],
        series: ['Total distance']
      };
      $scope.doughnut = {
        labels: [],
        data: []
      };
      TrainingRecordsService.getTrainings().then(function(result) {
        var groupedByDay = {};
        var groupedByMonth = {};
        var groupedByWeek = {};

        for(var i = 0; i < result.length; i++) {
          $scope.statistics.totalDistance += +result[i].distance;

          groupedByDay[moment(+result[i].timestamp).format('D MMM YYYY')] = groupedByDay[moment(+result[i].timestamp).format('D MMM YYYY')] || 0;
          groupedByDay[moment(+result[i].timestamp).format('D MMM YYYY')] += +result[i].distance;

          groupedByMonth[moment(+result[i].timestamp).format('MMM YYYY')] = groupedByMonth[moment(+result[i].timestamp).format('MMM YYYY')] || 0;
          groupedByMonth[moment(+result[i].timestamp).format('MMM YYYY')] += +result[i].distance;

          groupedByWeek[moment(+result[i].timestamp).format('dddd')] = groupedByWeek[moment(+result[i].timestamp).format('dddd')] || 0;
          groupedByWeek[moment(+result[i].timestamp).format('dddd')] += +result[i].distance;

          if(moment(+result[i].timestamp).isSame(moment(), 'day')) {
            $scope.statistics.thisDay += +result[i].distance;
          }
          if(moment(+result[i].timestamp).isSame(moment(), 'week')) {
            $scope.statistics.totalThisWeekDistance += +result[i].distance;
          }
          if(moment(+result[i].timestamp).isSame(moment(), 'month')) {
            $scope.statistics.totalThisMonthDistance += +result[i].distance;
          }
          if(moment(+result[i].timestamp).isSame(moment().subtract(1, 'weeks'), 'week')) {
            $scope.statistics.totalLastWeekDistance += +result[i].distance;
          }
          if(moment(+result[i].timestamp).isSame(moment().subtract(1, 'months'), 'month')) {
            $scope.statistics.totalLastMonthDistance += +result[i].distance;
          }
        };
        $scope.statistics.averageInDay = Number(($scope.statistics.totalDistance / Object.keys(groupedByDay).length).toFixed(0)); 
        $scope.statistics.averageInMonth = Number(($scope.statistics.totalDistance / Object.keys(groupedByMonth).length).toFixed(0));

        for(var i = 0; i < 6; i++) { //last 6 months bar chart data
          var monthLabel = moment().subtract(5 - i, 'months').format('MMM YYYY');
          $scope.bar.labels.push(monthLabel);
          $scope.bar.data[0].push(groupedByMonth[monthLabel] || 0);          
        }
        for(var i = 1; i <= 7; i++) {
          var weekLabel = moment().isoWeekday(i).format('dddd');
          $scope.doughnut.labels.push(weekLabel);
          $scope.doughnut.data.push(groupedByWeek[weekLabel] || 0);  
        }
        

        $scope.loading = false;
      }, function(error) {
        $scope.loading = false;
        $ionicPopup.alert({
          title: 'Swim Fit',
          template: error
        });
      });
    });
    
  	$scope.slideHasChanged = function(index) {
  	}
  }
]);