var express = require('express');
var bodyparser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var request = require('request');
var app = express();

// Static file hosting
app.use(express.static('client'));

//////////////////////////////////////////////
app.get('/login', function (req, res) {
  res.redirect('https://github.com/login/oauth/authorize?client_id=12146793ecfda5b5ee2e&scope=user&state=iamunguessable');
});

app.use(bodyparser.json());
// cient id en client secret veranderen door eigen code
app.get('/api/callback', function (req, res) {
  if (req.query.state == 'iamunguessable') {  // Probably not really the best practice ..
    // TODO Replace the credentials below by your own
    exchange_options = {
      url: 'https://github.com/login/oauth/access_token?client_id=12146793ecfda5b5ee2e&client_secret=7c214022cfec09b9a8d354560383e0d925123190&code=' + req.query.code + '&state=iamunguessable',
      headers: {
        'Accept': 'application/json'
      }
    };
    request.post(exchange_options, function (error, response, body) {
      // Je kan ook de access token in de sessie opslaan en dat dan gebruiken zonder dat de browser het met elke request moet meesturen
      res.redirect('http://localhost:5000/#/?access_token=' + JSON.parse(body).access_token);
    });
  }
});
////////////////////////////////////////////////



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