var express = require('express');
var router = express.Router();

router.get('/random_quote',function(req,res){
	var db = req.db;
	var quotes = db.get('quotes');
});

module.exports = router;