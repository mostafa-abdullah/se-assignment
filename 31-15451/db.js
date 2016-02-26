var mongo         = require('mongodb');
var monk          = require('monk');
var DB = null;



/**
	Uses monk layer to establish a connection with the database.
*/
var connect = module.exports.connect = function(cb){
	DB = monk('localhost:27017/quotes_db');

	cb(DB);
}


/**
	If there is no prior connection with the database, it creates one.
	Returns the database.

*/
var db = module.exports.db = function (){
	if(DB == null)
		connect(function(db){

		});
	return DB;
}


/**
	Clears the quotes collection in the database.

*/
var clearDB = module.exports.clearDB = function(cb){
	// connect(function(db){
		if(DB == null)
			connect(function(db){

			});

		var quotes = DB.get('quotes');
		quotes.drop();
		cb();
	// });
}
