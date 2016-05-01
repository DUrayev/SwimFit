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
  		return '1 Day Trainig';
  	} else if(+input === 1) {
		return 'All Week Trainig';
  	}
    return input;
  };
});
