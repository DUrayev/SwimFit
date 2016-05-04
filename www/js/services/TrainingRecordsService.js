'use strict';

/* Services */

var swimFitServices = angular.module('swimFitServices', []);

swimFitServices.factory('TrainingRecordsService', function($q) {

	var createTableIfNotExists = function(tx) {
		tx.executeSql('CREATE TABLE IF NOT EXISTS training_records (id integer primary key autoincrement, period integer, photo_src text, description text, timestamp text, distance integer)');
	};

	return {
    	saveTraining: function(training) { 
    		return $q(function(resolve, reject) {
    			var db = window.openDatabase("Database", "1.0", "Swim Fit", 200000);
	    		db.transaction(function populateDB(tx) {
					createTableIfNotExists(tx);
	             	tx.executeSql('INSERT INTO training_records (period, photo_src, description, timestamp, distance)' + 
	     										' VALUES (' + (training.period || 2) + ', "' + (training.photoSrc || '') + '", "' + (training.description || '') + '",' + 
     											' "' + (training.timestamp || '') + '", ' + (training.distance || '0') + ')');
			    }, function errorCB(err) {
			        reject("Error processing SQL: "+ err.message);
			    }, function successCB() {
			        resolve('Success');
			    });
    		}); 		
    		
    	},

    	deleteTraining: function(trainingId) {
    		return $q(function(resolve, reject) {
    			var db = window.openDatabase("Database", "1.0", "Swim Fit", 200000);
	    		db.transaction(function deleteRecordDB(tx) {
	             	tx.executeSql('DELETE FROM training_records WHERE id = ?', [trainingId]);
			    }, function errorCB(err) {
			        reject("Error processing SQL: "+ err.message);
			    }, function successCB() {
			        resolve('Success');
			    });
    		});
    	},

    	getTrainings: function() {
    		return $q(function(resolve, reject) {
    			function querySuccess(tx, results) {
					var trainingRecords = [];
					var photosByWeek = {};
					for (var i=0; i<results.rows.length; i++){
						var startOfWeekLabel = moment(+results.rows.item(i).timestamp).startOf('isoweek').format('D-M-YYYY');
						if(results.rows.item(i).photo_src && +results.rows.item(i).period === 1) { //if photo period for all week
							photosByWeek[startOfWeekLabel] = results.rows.item(i).photo_src;
						}
						trainingRecords.push({
							id: results.rows.item(i).id,
							period: results.rows.item(i).period,
							photoSrc: results.rows.item(i).photo_src,
							description: results.rows.item(i).description,
							timestamp: results.rows.item(i).timestamp,
							distance: results.rows.item(i).distance
						});
				    }
				    for (var i=0; i < trainingRecords.length; i++){
						var startOfWeekLabel = moment(+trainingRecords[i].timestamp).startOf('isoweek').format('D-M-YYYY');
						if(photosByWeek[startOfWeekLabel] && !trainingRecords[i].photoSrc) {
							trainingRecords[i].period = '1';
							trainingRecords[i].photoSrc = photosByWeek[startOfWeekLabel];
						}
				    }

				    trainingRecords = trainingRecords.sort(function (a,b) {
				        if (+a.timestamp < +b.timestamp) {
				          return 1;
				        } else if (+a.timestamp > +b.timestamp) {
				          return -1;
				        } else {
				          return 0;
			    	    }
			      	});
				    resolve(trainingRecords);
				}
	    		var db = window.openDatabase("Database", "1.0", "Swim Fit", 200000);
				db.transaction(function queryDB(tx) {
					createTableIfNotExists(tx);
				    tx.executeSql('SELECT * FROM training_records', [], querySuccess, 
		    	function errorCB(err) {
				    reject("Error processing SQL: "+err.message);
				});
				}, function errorCB(err) {
				    reject("Error processing SQL: "+err.message);
				});
    		});    		
    	}
    }
  }
);