var express = require('express');
var bodyparser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;

var app = express();

// Static file hosting
app.use(express.static('client'));

// Connect to database
var db;
var personsTable;
MongoClient.connect('mongodb://localhost:27017/project', function (err, _db) {
  if (err) throw err; // Let it crash
  console.log("Connected to MongoDB");

  db = _db;
  personsTable = db.collection('persons'); // Save some keystrokes..
});

// Disconnect after CTRL+C
process.on('SIGINT', function() {
  console.log("Shutting down Mongo connection");
  db.close();
  process.exit(0);
});

app.get('/api/users', function (req, res) {
  personsTable.find().toArray(function (err, persons) {
    // TODO Handle error
    res.status(200).json(persons);
  });
});

app.use(bodyparser.json());

app.post('/api/user', function (req, res) {
  newUser = { 'firstname' : req.body.firstname };
    console.log(newUser);
  personsTable.insert(newUser, function (err, result) {
    // TODO Handle error
    personsTable.find().toArray(function (err, persons) {
      // TODO Handle error
      res.status(201).json(persons);
    });
  });
});

app.post('/api/deleteUser', function(req, res) {
  newUser = { 'firstname' : req.body.firstname };
    console.log(newUser);
  personsTable.deleteOne(newUser, function (err, result) {
    // TODO Handle error
    personsTable.find().toArray(function (err, persons) {
      // TODO Handle error
      res.status(200).json(persons);
    });
  });
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.listen(5000);