var express = require('express');
var router = express.Router();

router.get('/random_quote',function(req,res){
	res.send('This is a quote');
});

router.get('/index',function(req,res){
	res.render('index');
});



module.exports = router;