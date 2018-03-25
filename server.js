const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const dbString = "mongodb://paske:StoredInGithubCode2018!@ds033986.mlab.com:33986/paske";

const dbName = "paske";
const collectionName = "renn";
//app.get('/', (req, res) => res.send('Hello World!'));
app.use(express.static('dist'));

app.use(bodyParser.urlencoded({
    extended: false
 }));
app.use(bodyParser.json());

app.get('/api', (req, res) => {
    res.send(new Date().toString());
});

app.get('/api/v1/renn', (req, res) => {
    MongoClient.connect(dbString, (err, client) => {  
        if (err) {
          return console.log(err);
        }
        const db = client.db(dbName);
        findCollections(db, collectionName, (docs) => {
            res.json(docs);
        });
        client.close();
      });
});

app.post('/api/v1/renn', (req, res) => {
    console.log(req.body);
    getDb((collection, db, client) => {
        collection.update({year: req.body.year}, req.body, {upsert: true}, (err) => {
            if(err){
                console.log(err);
                res.statusCode = 404;
                res.json({status: err});
            }
            res.json({status: "ok"});
            client.close();
        });
    });

});

app.get('/api/v1/renn/:year', (req, res) => {
    MongoClient.connect(dbString, (err, client) => {  
        if (err) {
          return console.log(err);
        }
        const db = client.db(dbName);
        findCollectionByYear(Number(req.params["year"]), db, collectionName, (docs) => {
            res.json(docs);
        });
        client.close();
      });
});
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

const findCollections = (db, collectionName, callback) => {
    // Get the documents collection
    const collection = db.collection(collectionName);
    // Find some documents
    collection.find({}, { fields: {runners: 0}}).toArray(function(err, docs) {
      if(err){
          console.log(err);
      }
      callback(docs);
    });
  };
  const findCollectionByYear = (year, db, collectionName, callback) => {
      console.log(year);
    // Get the documents collection
    const collection = db.collection(collectionName);
    // Find some documents
    collection.findOne({year}, function(err, docs) {
      if(err){
          console.log(err);
      }
      callback(docs);
    });
  };

  const getDb = (callback) => {
    MongoClient.connect(dbString, (err, client) => {  
        if (err) {
          return console.log(err);
        }
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        callback(collection, db, client);
    });
  };