var assert = require('chai').assert;
var app = require('../app.js');
var request = require('supertest');
var Quote = require('../quotes.js');
var db = require('../db.js');

before(function(done) {
    // use this after you have completed the connect function
    db.connect(function(db) {
       done();
    });
});


describe("getElementByIndexElseRandom", function() {
    var arr = [1, 2, 3, 43, 5];
    it("should return a random element that is included in the array if we omit the index", function() {
        var randomElement = Quote.getElementByIndexElseRandom(arr);
        assert(arr.indexOf(randomElement) > -1 , "Returned element doesn't exist in the array");
    });
    it("should return the first element if we also pass the index 0", function() {
        var firstElement = Quote.getElementByIndexElseRandom(arr,0);
        assert(firstElement == arr[0], "Expected first element to be "+arr[0]+", found "+firstElement);
    });
    it("should return the last element if we also pass the index", function() {
        var lastElement = Quote.getElementByIndexElseRandom(arr, arr.length-1);
        assert(lastElement == arr[arr.length-1], "Expected last element to be "+arr[4]+", found "+lastElement);
    });
});

describe("getQuotesFromJSON", function() {
    var quotes = Quote.getQuotesFromJSON();
    it("should return an array of 102 quote", function() {
        assert(quotes.length == 102, "Expected quotes length of 102, found "+quotes.length);
    });
    it("first quote in the array's author should be Kevin Kruse", function() {
        assert(quotes[0].author == 'Kevin Kruse', "Expected first quote's author to be Kevin Kruse, found " + quotes[0].author);
    });
});

describe("getQuoteFromJSON", function() {
    it('should return a quote object with an author and text property', function() {
        var quote = Quote.getQuoteFromJSON();
        assert.isObject(quote, 'quote is an object');
        assert.property(quote, 'author');
        assert.property(quote, 'text');
    });

    it('should return a random quote if index not specified', function() {
       var quote = Quote.getQuoteFromJSON();
       var quotes = Quote.getQuotesFromJSON();
       var found = false;
       for(var i = 0; i<quotes.length; i++){
        if(quote.author === quotes[i].author && quote.text == quotes[i].text){
            found = true;
            break;
        }
       }
       assert(found, "Returned quote doesn't exist in the quotes JSOn file");
    });

    it('should return the first quote if we pass 0', function() {
        var quote = Quote.getQuoteFromJSON(0);
        var quotes = Quote.getQuotesFromJSON();

        assert(quote.author == quotes[0].author && quote.text == quotes[0].text, 
            "Returned quote doesn't match with the first quote in the JSON file. \nExpected: "+JSON.stringify(quotes[0])+".\n Found: "+JSON.stringify(quote));
    });
});

// quotes collection should be called quotes
describe('seed', function() {
    before(db.clearDB);
    it('should populate the db if db is empty returning true', function(done) {
        Quote.seed(function(error, seeded){
            assert(seeded, "Couldn't populate database");
            done();    
        });

    });
    it('should have populated the quotes collection with 102 document', function(done) {
        Quote.getQuotesFromDB(function(err, quotes){
            assert(quotes.length == 102, "Expected number of quotes to be 102, found "+quotes.length);    
            done();
        });
        
    });
    it('should not seed db again if db is not empty returning false in the callback', function(done) {
        // TODO: assert that seeded is false
         Quote.seed(function(error, seeded){
            assert(!seeded, "Shouldn't seed an already populated database.");
            done();    
        });

    });
    it('should not seed db again if db is not empty', function(done) {
        // TODO: The database should have 102 quote still
        Quote.getQuotesFromDB(function(err, quotes){
            assert(quotes.length == 102, "Shouldn't seed again, expected number of quotes to be 102, found "+quotes.length);    
            done();
        });
    });
});

describe('getQuotesFromDB', function() {
    it('should return all quote documents in the database', function(done) {
        Quote.getQuotesFromDB(function(err, quotes){
            assert(quotes.length == 102, "Expected number of quotes to be 102, found "+quotes.length);    
            done();
        });
    });
});

describe('getQuoteFromDB', function() {

    it('should return a random quote document', function(done) {
        Quote.getQuotesFromDB(function(err, quotes){
            Quote.getQuoteFromDB(function(err2, quote){
                var found = false;
                for(var i = 0; i < quotes.length; i++){
                    if(quotes[i].author === quote.author && quotes[i].text === quote.text){
                        found = true;
                        break;
                    }
                }
                assert(found, "Returned quote doesn't exist in the database");
                done();
            });
        });
    });
    it('should return the first quote if passed 0 after callback', function(done) {
        Quote.getQuotesFromDB(function(err, quotes){
            Quote.getQuoteFromDB(function(err2, quote){
                assert(quote.author == quotes[0].author && quote.text == quotes[0].text, 
            "Returned quote doesn't match with the first quote in the database. \nExpected: "+JSON.stringify(quotes[0])+".\n Found: "+JSON.stringify(quote));
                done();
            } , 0);
        });
    });
});

describe('API', function() {
    request = request(app);
    it("should return a 404 for urls that don't exist", function(done) {
        // TODO: test with supertest
        request.get('/invalid_page').expect(404,done);
    });

    it('/api/quote should return a quote JSON object with keys [_id, text, author]', function(done) {
        // TODO: test with supertest
        request.get('/api/quote')
        .expect('Content-Type', /json/)
        .end(function(err, result){
            var quote = result.body;
            assert.isObject(quote, 'body is an object');
            assert.property(quote, '_id');
            assert.property(quote, 'author');
            assert.property(quote, 'text');
            done();
        });
    });

    it('/api/quotes should return an array of JSON object when I visit', function(done) {
        request.get('/api/quotes')
        .end(function(err, result){
            var quotes = result.body;
            assert.isArray(quotes, 'Returned body is not an array');
            var quote = quotes[0];
            assert.property(quote, '_id');
            assert.property(quote, 'author');
            assert.property(quote, 'text');
            done();
        });
    });
});