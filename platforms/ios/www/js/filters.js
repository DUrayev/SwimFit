'use strict';

/* Filters */

var filtersModule = angular.module('swimFitFilters', []);

filtersModule.filter('checkmark', function() {
  return function(input) {
    return input ? '\u2713' : '\u2718';
  };
});

filtersModule.filter('trainingPeriod', function() {
  return function(input) {
  	if(+input === 0){
  		return '1 Day Training';
  	} else if(+input === 1) {
		  return 'All Week Trainig';
  	} else if(+input === 2) { //No photo selected
  		return '';
  	}
    return input;
  };
});

filtersModule.filter('trainingDateTitle', function() {
  return function(input) {
    return moment(+input).format('D MMMM');
  };
});
filtersModule.filter('trainingDateDayOfWeek', function() {
  return function(input) {
  	return moment(+input).format('dddd');
  };
});

filtersModule.filter('compare', function() {
  return function(input) {
    if(input) {
      return 'ion-arrow-up-b balanced'
    } else {
      return 'ion-arrow-down-b assertive'
    }
  };
});

