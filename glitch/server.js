var firebase = require("firebase");
var config = {
  apiKey: "AIzaSyDTfoIGcBT9dpT67fzcOWcwmER29rD0X0M",
  authDomain: "portfolio-8b0ef.firebaseapp.com",
  databaseURL: "https://portfolio-8b0ef.firebaseio.com",
};
firebase.initializeApp(config);
firebase.auth().signInWithEmailAndPassword(process.env.EMAIL, process.env.PASSWORD);
var db = firebase.database();

var request = require('request');
var express = require('express');
var app = express();

// http://expressjs.com/en/starter/basic-routing.html
app.get("/read", function (req, resp) {
  if (!req.query.secret || (req.query.secret !== process.env.SECRET) ) {
    resp.send('wrong secret');
    return;
  }
  var options = {
    url: 'https://mercury.postlight.com/parser?url=' + req.query.url,
    headers: {
      'x-api-key': process.env.MERCURY
    }
  };
  request.get(options, function(error, response, body) {
    if (error || response.statusCode !== 200) {
      resp.send(error + '\n' + response.status_code);
      return;
    }
    var data = JSON.parse(body);
    var result = {
      title: data.title,
      url: data.url,
      dek: data.dek,
      image: data.lead_image_url,
      wc: data.word_count,
      time: new Date().toUTCString(),
      star: req.query.star ? req.query.star : false
    };
    db.ref('articles').push(result).then( () => {
      resp.send('saved ' + JSON.stringify(result));
    });
  });
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});