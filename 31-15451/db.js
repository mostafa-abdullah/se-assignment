var mongo         = require('mongodb');
var monk          = require('monk');


var connect = module.exports.connect = function(cb){
	var db = monk('localhost:27017/quotes_db');
	cb(db);
}

var db = module.exports.db = function (){
	connect(function(db){
		return db;
	});
}

var clearDB = module.exports.clearDB = function(cb){
	connect(function(db){
		var quotes = db.get('quotes');
		quotes.drop();
		cb();
	});
}

// clearDB(function(){
// 	console.log('cleared');
// });

// module.exports = [connect , db, clearDB];