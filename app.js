const express = require('express');
const fs = require('fs');
const requestIp = require('request-ip');
app = express();
app.use(requestIp.mw());
var server = app.listen(3002);
console.log('server started on :3002');

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);

db.defaults({
    votes: []
  })
  .write();

const requestify = require('requestify');

const config = require("./config.json")

const auth = require('basic-auth');

var authSrv = (req, res, next) => {
  let user = auth(req);

  if (user === undefined || user[`name`] !== 'admin' || user[`pass`] !== config.password) {
    res.statusCode = 401;
    res.setHeader('WWW-Authenticate', 'Basic realm="Node"');
    res.end('Unauthorized');
  } else {
    next();
  }
};

app.use('/admin', (req, res, next) => authSrv(req, res, next), function(req, res, next) {
  res.sendFile(__dirname + '/admin/admin.html');
});
app.use('/admin.js', (req, res, next) => authSrv(req, res, next), function(req, res, next) {
  res.sendFile(__dirname + '/admin/admin.js');
});
app.use('/admin.css', (req, res, next) => authSrv(req, res, next), function(req, res, next) {
  res.sendFile(__dirname + '/admin/admin.css');
});
app.use('/adminRequest', function(req, res, next) {
  var thingtosend = []
  db.get('votes').value().forEach((item, i) => {
    thingtosend.push({bidrag: item.bidrag})
  });
  res.send(thingtosend);
});

app.get('/vote', function(req, res) {
  requestify.get('http://ip-api.com/json/' + req.clientIp)
    .then(function(response) {
      // Get the response body (JSON parsed or jQuery object for XMLs)
      console.log(req.query.vote, req.clientIp, response.getBody().countryCode);
      if (response.getBody().countryCode == 'SE') { // If the person is in sweeden
        if (db.get('votes').find({
            ip: req.clientIp
          }).value()) {
          res.send('voted');
        } else {
          db.get('votes').push({
            ip: req.clientIp,
            bidrag: req.query.vote,
            timestamp: new Date()
          }).write();
          res.send('success');
        }
      } else {
        res.send('country');
      }
    });
});


app.get('/', function(req, res) {
  sendFile(__dirname + '/client/index.html', res, req);
}); // Send index

app.get('/results', function(req, res) {
  sendFile(__dirname + '/client/results/results.html', res, req);
})

app.get('/:page', function(req, res) { // Send page ex. /index or favicon
  var page = req.params.page.toLowerCase();
  sendFile(`${__dirname}/client/${page}`, res, req); // Send webpage ex /index
});
app.get('/:folder/:page', function(req, res) { // Send page ex. /index or favicon
  var folder = req.params.folder.toLowerCase();
  var page = req.params.page.toLowerCase();
  sendFile(`${__dirname}/client/${folder}/${page}`, res, req); // Send webpage ex /index
});

function sendFile(path, res, req) { // Send file function
  if (fs.existsSync(path)) { // If file exists send it
    res.sendFile(path);
  } else { // Else send 404 error
    res.sendStatus(404);
  }
}
