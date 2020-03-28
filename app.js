var express = require('express');
var fs = require('fs');
var requestIp = require('request-ip');
app = express();
app.use(requestIp.mw())
var server = app.listen(3002);
console.log('server started on :3002')

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)

db.defaults({ votes: [] })
  .write()


app.get('/vote', function(req, res) {
  console.log(req.query.vote, req.clientIp, db.get('votes'))
  if(db.get('votes').find({ ip: req.clientIp }).value()) {
    res.send('voted')
  } else {
    db.get('votes').push({ ip: req.clientIp, bidrag: req.query.vote}).write()
    res.send('success')
  }
})



app.get('/', function(req, res) {
  sendFile(__dirname + '/client/index.html', res, req)
}); // Send index

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
    res.sendFile(__dirname + '/client/err/404.html');
  }
}
