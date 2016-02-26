var fs 			= require('fs');
var database	= require('./db');
var db = database.db(); 



/**
	Takes an array and an optional index.
	Returns the element at this index from the array, or a random element if the index is not provided
*/

var getElementByIndexElseRandom = module.exports.getElementByIndexElseRandom = function(arr, index){
	
	if(index != null)
		return arr[index];
	if(index >= arr.length){
		return 0;
	}
	return arr[Math.floor(Math.random()*arr.length)];
}




/**
	Reads the quotes.json file.
	Returns a JSON representation of its contents.
	To be used in database seeding.
*/
var getQuotesFromJSON = module.exports.getQuotesFromJSON = function(){
	return JSON.parse(fs.readFileSync('../quotes.json', 'utf8'));	
}



/**
	Takes an optional index.
	Returns the quote at this index from the quotes.json file, or random quote of index is not provided.
*/

var getQuoteFromJSON = module.exports.getQuoteFromJSON = function (index){
	var all_quotes = getQuotesFromJSON();
	return getElementByIndexElseRandom(all_quotes,index);
}


/**
	Reads the quotes from quotes.json file.
	Populates the database with the quotes from this file.
	Calls a callback function with any possible errors, and a boolean value
	representing if the seeding was successfull or not.
	It seeds the database only if it is empty.
	
*/

var seed = module.exports.seed = function (cb){
	// database.connect(function(db){
		var quotes = db.get('quotes');
		var all_quotes 	= getQuotesFromJSON();
		quotes.find({},{},function(err, docs){
			var error = err;
			var seeded = false;

			if(!docs.length){
				seeded = true;
				quotes.insert(all_quotes);
			}

			cb(error, seeded);
		});
	// });
		
}



/**
	Reads the quotes from quotes collection in the database.
	Calls a callback function with the returned quotes.

*/
getQuotesFromDB = module.exports.getQuotesFromDB = function(cb){
	// database.connect(function(db){
		var quotes = db.get('quotes');
		quotes.find({},{},function(err, docs){
			cb(err,docs);
		});
	// });
	
}


/**
	Takes an index.
	Reads the quote at this index from quotes collection in the database, or random quote if the
	index is not provided.
	it calls a callback function with this quote.

*/
var getQuoteFromDB = module.exports.getQuoteFromDB = function(cb,index){
	getQuotesFromDB(function(err, docs){
		var quote = getElementByIndexElseRandom(docs,index);
		cb(err,quote);
	});
}










