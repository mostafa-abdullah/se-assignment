var express = require('express');
var quotes = require('./quotes');
var router = express.Router();


router.get('/',function(req,res){
	res.render('index');
});

router.get('/index.html',function(req,res){
	res.render('index');
});

router.get('/index',function(req,res){
	res.render('index');
});

router.get('/api/quote',function(req,res){
	quotes.getQuoteFromDB(function(error, quote){
		res.json(quote);
	});
});

router.get('/api/quotes',function(req,res){
	quotes.getQuotesFromDB(function(error, quotes){
		res.json(quotes);
	});
});


module.exports = router;