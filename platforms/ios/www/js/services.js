'use strict';

/* Services */

var swimFitServices = angular.module('swimFitServices', []);

swimFitServices.factory('TrainingRecordsService', function() {
	return {
    	saveTraining: function(training) {    		
    		var db = window.openDatabase("Database", "1.0", "Swim Fit", 200000);
    		
    		db.transaction(function populateDB(tx) {
    			 tx.executeSql('DROP TABLE IF EXISTS training_records');
				tx.executeSql('CREATE TABLE IF NOT EXISTS training_records (id integer primary key autoincrement, period integer, photo_src text, description text)');
             	tx.executeSql('INSERT INTO training_records (period, photo_src, description)' + 
     										' VALUES (' + training.period + ', "' + training.photo_src + '", "' + training.description + '")');
		    }, function errorCB(err) {
		        alert("Error processing SQL: "+ err.code);
		    }, function successCB() {
		        alert("success!");
		    });
    	},

    	getTraining: function() {
    		function querySuccess(tx, results) {
			    var len = results.rows.length;
				alert("training_records table: " + len + " rows found.");
				for (var i=0; i<len; i++){
					console.log("Row = " + i + " ID = " + results.rows.item(i).id + " Description =  " + results.rows.item(i).description);
			    }
			}
    		var db = window.openDatabase("Database", "1.0", "Swim Fit", 200000);
			db.transaction(function queryDB(tx) {
			    tx.executeSql('SELECT * FROM training_records', [], querySuccess, function errorCB(err) {
			    alert("Error processing SQL: "+err.code);
			});
			}, function errorCB(err) {
			    alert("Error processing SQL: "+err.code);
			});
    	}
    }
  }
);