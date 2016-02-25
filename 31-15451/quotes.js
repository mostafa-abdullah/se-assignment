var fs 			= require('fs');
var database	= require('./db'); 




var getElementByIndexElseRandom = module.exports.getElementByIndexElseRandom = function(arr, index){
	if(index)
		return arr[index];
	return arr[Math.floor(Math.random()*arr.length)];
}




var getQuotesFromJSON = module.exports.getQuotesFromJSON = function(){
	return JSON.parse(fs.readFileSync('../quotes.json', 'utf8'));	
}



var getQuoteFromJSON = module.exports.getQuoteFromDB = function (index){
	var all_quotes = getQuotesFromJSON();
	return getElementByIndexElseRandom(all_quotes,index);
}


var seed = module.exports.seed = function (cb){
	database.connect(function(db){
		var quotes = db.get('quotes');
		var all_quotes 	= getQuotesFromJSON();
		quotes.find({},{},function(err, docs){
			var error;
			var seeded = false;
			if(docs.length){
				if(!err)
					seeded = true;
				else
					error = err;
			}
			else{
				
				seeded = true;
				quotes.insert(all_quotes);
			}
			cb(error, seeded);
		});
	});
		
}


getQuotesFromDB = module.exports.getQuotesFromDB = function(cb){
	database.connect(function(db){
		var quotes = db.get('quotes');
		quotes.find({},{},function(err, docs){
			cb(err,docs);
		});
	});
	
}

var getQuoteFromDB = module.exports.getgetQuoteFromDB = function(cb,index){
	getQuotesFromDB(function(err, docs){
		var quote = getElementByIndexElseRandom(docs,index);
		cb(err,quote);
	});
}

getQuotesFromDB(function(err,docs){
	if(!err)
		console.log(docs);
});

// getQuoteFromDB(function(err, quote){
// 	console.log(quote);
// },2);

// seed(function(err, seeded){
// 	if(seeded)
// 		console.log("Seeded");
// })












