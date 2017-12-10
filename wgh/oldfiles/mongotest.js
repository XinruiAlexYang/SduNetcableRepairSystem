var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

var url = "mongodb://localhost:27017/wgh";

MongoClient.connect(url, function(err, db){
   var collection = db.collection('report');
   collection = db.collection('report');
   collection.find().sort({_id:-1}).limit(10).toArray(function(err, items){
       console.log(items);
   });
});