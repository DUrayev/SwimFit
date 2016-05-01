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

    	getTrainings: function() {
    		return $q(function(resolve, reject) {
    			function querySuccess(tx, results) {
					var trainingRecords = [];
					for (var i=0; i<results.rows.length; i++){
						trainingRecords.push({
							id: results.rows.item(i).id,
							period: results.rows.item(i).period,
							photoSrc: results.rows.item(i).photo_src,
							description: results.rows.item(i).description,
							timestamp: results.rows.item(i).timestamp,
							distance: results.rows.item(i).distance
						});
				    }
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